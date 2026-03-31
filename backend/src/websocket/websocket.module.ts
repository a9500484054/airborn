/**
 * Websocket Module
 * Registers WebSocket gateways
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../modules/messages/messages.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    MessagesModule,
    UsersModule,
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketModule {}
