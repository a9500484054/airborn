/**
 * Messages Service
 * Handles message-related business logic
 */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  /**
   * Create a new message
   */
  async create(sendMessageDto: SendMessageDto, userId: string): Promise<Message> {
    const { content, fileUrl, fileType, replyToId } = sendMessageDto;

    // Validate that at least content or file is provided
    if (!content && !fileUrl) {
      throw new Error('Either content or fileUrl must be provided');
    }

    const message = this.messagesRepository.create({
      content,
      fileUrl,
      fileType,
      replyToId,
      userId,
    });

    return await this.messagesRepository.save(message);
  }

  /**
   * Get messages with pagination
   */
  async findAll(page: number = 1, limit: number = 50) {
    const [messages, total] = await this.messagesRepository.findAndCount({
      relations: ['user', 'replyTo', 'replyTo.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: messages.reverse(), // Return in chronological order
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search messages by content
   */
  async search(query: string, page: number = 1, limit: number = 20) {
    const [messages, total] = await this.messagesRepository.findAndCount({
      where: {
        content: ILike(`%${query}%`),
      },
      relations: ['user', 'replyTo', 'replyTo.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get message by ID
   */
  async findOne(id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['user', 'replyTo', 'replyTo.user'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  /**
   * Delete message (only own messages)
   */
  async remove(id: string, userId: string): Promise<void> {
    const message = await this.findOne(id);

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messagesRepository.remove(message);
  }
}
