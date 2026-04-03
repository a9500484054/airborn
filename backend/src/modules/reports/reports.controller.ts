/**
 * Reports Controller
 * Handles HTTP requests for report management (user endpoints)
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/report.dto';

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new time report' })
  async create(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(req.user.id, createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my reports with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.reportsService.findAllByUser(req.user.id, page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete my report' })
  @ApiParam({ name: 'id', type: String, description: 'Report ID' })
  async remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    await this.reportsService.remove(id, req.user.id);
    return { message: 'Report deleted successfully' };
  }
}
