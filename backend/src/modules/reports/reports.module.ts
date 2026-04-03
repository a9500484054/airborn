/**
 * Reports Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AdminReportsController } from './admin/admin-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController, AdminReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
