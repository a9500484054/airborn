/**
 * Chat WebSocket Gateway
 * Handles real-time messaging via WebSockets
 */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../modules/messages/messages.service';
import { SendMessageDto } from '../modules/messages/dto/message.dto';
import { UsersService } from '../modules/users/users.service';
import { PushNotificationService } from '../modules/push-notification/push-notification.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately in production
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private messagesService: MessagesService,
    private usersService: UsersService,
    private pushNotificationService: PushNotificationService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract JWT from query params
      const token = client.handshake.query.token as string;

      if (!token) {
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }) as JwtPayload;

      // Check if user exists and is not blocked
      const user = await this.usersService.findByIdWithSensitive(payload.sub);
      if (!user || user.isBlocked || user.isDeleted) {
        client.emit('error', { message: 'User not authorized' });
        client.disconnect();
        return;
      }

      // Store user connection
      this.connectedUsers.set(payload.sub, client.id);
      client.data.userId = payload.sub;
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        name: user.name,
        role: payload.role,
        avatar: user.avatar,
      };

      this.logger.log(`User connected: ${user.name} (${payload.sub})`);

      // Notify others about user online
      client.broadcast.emit('user_online', { userId: payload.sub });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User disconnected: ${userId}`);
      client.broadcast.emit('user_offline', { userId });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    try {
      const userId = client.data.userId;
      const user = client.data.user;

      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      // Create message in database
      const message = await this.messagesService.create(data, userId);

      const messageData = {
        id: message.id,
        content: message.content,
        fileUrl: message.fileUrl,
        fileType: message.fileType,
        replyToId: message.replyToId,
        replyTo: message.replyTo,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        createdAt: message.createdAt,
      };

      // Broadcast to all connected clients
      this.server.emit('new_message', messageData);

      // Send push notification to offline users
      const pushPayload = JSON.stringify({
        title: `AirBorn - ${user.name}`,
        body: message.content || '📎 Вложение',
        icon: '/logo.svg',
        badge: '/logo.svg',
        data: { 
          url: '/chat',
          messageId: message.id,
          senderId: user.id,
          senderName: user.name,
        },
      });

      // Отправляем push всем кроме отправителя
      await this.pushNotificationService.sendToOthers(userId, pushPayload);

      return { event: 'message_sent', data: message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (user) {
      client.broadcast.emit('user_typing', {
        userId: user.id,
        userName: user.name,
        isTyping: true,
      });
    }
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (user) {
      client.broadcast.emit('user_typing', {
        userId: user.id,
        userName: user.name,
        isTyping: false,
      });
    }
  }

  @SubscribeMessage('mark_read')
  handleMarkRead(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (user) {
      client.broadcast.emit('messages_read', {
        userId: user.id,
        readAt: new Date(),
      });
    }
  }

  // Send message to specific user
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
