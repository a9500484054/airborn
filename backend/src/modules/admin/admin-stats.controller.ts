/**
 * Admin Stats Controller
 * Exposes admin dashboard statistics endpoints
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminStatsService } from './admin-stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getStats() {
    const stats = await this.adminStatsService.getStats();
    return {
      success: true,
      data: stats,
    };
  }
}
