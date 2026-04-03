/**
 * Reports Service
 * Handles report-related business logic
 */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  /**
   * Create a new report for current user
   */
  async create(userId: string, createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create({
      ...createReportDto,
      userId,
    });
    return await this.reportsRepository.save(report);
  }

  /**
   * Get all reports for current user with pagination
   */
  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const where: FindOptionsWhere<Report> = { userId };

    const [reports, total] = await this.reportsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get report by ID and check ownership
   */
  async findOneAndCheckOwnership(id: string, userId: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.userId !== userId) {
      throw new ForbiddenException('You can only manage your own reports');
    }

    return report;
  }

  /**
   * Delete report (user can only delete own)
   */
  async remove(id: string, userId: string): Promise<void> {
    const report = await this.findOneAndCheckOwnership(id, userId);
    await this.reportsRepository.remove(report);
  }

  // ===== ADMIN METHODS =====

  /**
   * Get all reports with pagination and filters
   */
  async findAllAdmin(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      object?: string;
    },
  ) {
    const queryBuilder = this.reportsRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user');

    // Apply filters
    if (filters?.search) {
      queryBuilder.andWhere('user.name ILIKE :search', { search: `%${filters.search}%` });
    }

    if (filters?.dateFrom) {
      queryBuilder.andWhere('report.date >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters?.dateTo) {
      queryBuilder.andWhere('report.date <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters?.object) {
      queryBuilder.andWhere('report.object ILIKE :object', { object: `%${filters.object}%` });
    }

    queryBuilder.orderBy('report.date', 'DESC');

    const [reports, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update any report (admin)
   */
  async updateAdmin(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.reportsRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    Object.assign(report, updateReportDto);
    return await this.reportsRepository.save(report);
  }

  /**
   * Delete any report (admin)
   */
  async removeAdmin(id: string): Promise<void> {
    const report = await this.reportsRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.reportsRepository.remove(report);
  }
}
