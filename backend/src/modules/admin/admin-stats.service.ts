/**
 * Admin Stats Service
 * Handles admin dashboard statistics
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  /**
   * Get admin dashboard statistics
   */
  async getStats() {
    const [totalUsers, totalProjects, totalLeads, totalMessages] = await Promise.all([
      this.usersRepository.count(),
      this.projectsRepository.count(),
      this.leadsRepository.count(),
      this.messagesRepository.count(),
    ]);

    return {
      totalUsers,
      totalProjects,
      activeLeads: totalLeads,
      totalMessages,
    };
  }
}
