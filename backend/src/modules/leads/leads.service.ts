/**
 * Leads Service
 * Handles lead-related business logic
 */
import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './entities/lead.entity';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
  ) {}

  /**
   * Create a new lead
   */
  async create(createLeadDto: CreateLeadDto, ipAddress?: string): Promise<Lead> {
    const lead = this.leadsRepository.create({
      ...createLeadDto,
      ipAddress,
    });
    return await this.leadsRepository.save(lead);
  }

  /**
   * Get all leads with pagination
   */
  async findAll(page: number = 1, limit: number = 20) {
    const [leads, total] = await this.leadsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get lead by ID
   */
  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  /**
   * Update lead status
   */
  async updateStatus(id: string, updateLeadStatusDto: UpdateLeadStatusDto): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.status = updateLeadStatusDto.status;
    return await this.leadsRepository.save(lead);
  }
}
