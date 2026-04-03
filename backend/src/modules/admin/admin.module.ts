/**
 * Admin Module
 * Handles admin-specific functionality
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Message } from '../messages/entities/message.entity';
import { AdminStatsService } from './admin-stats.service';
import { AdminStatsController } from './admin-stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, Lead, Message]),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
  exports: [AdminStatsService],
})
export class AdminModule {}
