/**
 * Report DTOs
 */
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ description: 'Дата отчёта', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Объект', example: 'ЖК Центральный' })
  @IsString()
  @IsNotEmpty()
  object: string;

  @ApiProperty({ description: 'Часы', example: 8, minimum: 0.5 })
  @IsNumber()
  @Min(0.5)
  hours: number;
}

export class UpdateReportDto {
  @ApiProperty({ description: 'Дата отчёта', example: '2024-01-15', required: false })
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Объект', example: 'ЖК Центральный', required: false })
  @IsString()
  object?: string;

  @ApiProperty({ description: 'Часы', example: 8, minimum: 0.5, required: false })
  @IsNumber()
  @Min(0.5)
  hours?: number;
}
