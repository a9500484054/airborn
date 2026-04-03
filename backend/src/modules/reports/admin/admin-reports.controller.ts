/**
 * Admin Reports Controller
 * Handles HTTP requests for admin report management
 */
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ReportsService } from '../reports.service';
import { UpdateReportDto } from '../dto/report.dto';

@ApiTags('admin-reports')
@Controller('admin/reports')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports (admin) with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by user name' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Date from (YYYY-MM-DD)' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Date to (YYYY-MM-DD)' })
  @ApiQuery({ name: 'object', required: false, type: String, description: 'Search by object name' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('object') object?: string,
  ) {
    return this.reportsService.findAllAdmin(page, limit, {
      search,
      dateFrom,
      dateTo,
      object,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update any report (admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Report ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.updateAdmin(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete any report (admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Report ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.reportsService.removeAdmin(id);
    return { message: 'Report deleted successfully' };
  }
}
