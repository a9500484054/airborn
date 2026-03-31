/**
 * Leads Controller
 * Handles HTTP requests for leads
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a new lead (contact form)' })
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @Headers('x-forwarded-for') forwardedFor: string,
    @Headers('x-real-ip') realIp: string,
  ) {
    // Get IP address from headers
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const lead = await this.leadsService.create(createLeadDto, ipAddress);
    return lead;
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all leads (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.leadsService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead by ID (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Lead ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead status (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Lead ID' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadStatusDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, updateLeadStatusDto);
  }
}
