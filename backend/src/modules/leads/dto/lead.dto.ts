/**
 * Leads DTOs
 * Data Transfer Objects for lead operations
 */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '+79991234567', description: 'Phone number' })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPhoneNumber('RU', { message: 'Invalid Russian phone number format' })
  phone: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiPropertyOptional({ example: 'I am interested in your services...', description: 'Comment' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateLeadStatusDto {
  @ApiProperty({ enum: LeadStatus, description: 'New status' })
  @IsNotEmpty()
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
