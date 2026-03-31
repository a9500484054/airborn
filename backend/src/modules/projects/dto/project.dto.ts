/**
 * Projects DTOs
 * Data Transfer Objects for project operations
 */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  MaxLength,
  ValidateNested,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectFileDto {
  @ApiProperty({ description: 'File URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'File name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  @Min(0)
  size: number;

  @ApiProperty({ description: 'MIME type' })
  @IsString()
  mimeType: string;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Amazing Project', description: 'Project title' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @ApiProperty({ example: 'Short description', description: 'Short description' })
  @IsNotEmpty({ message: 'Short description is required' })
  @IsString()
  @MaxLength(500, { message: 'Short description must not exceed 500 characters' })
  shortDescription: string;

  @ApiProperty({ example: 'Full project description...', description: 'Full description' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of image URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [ProjectFileDto], description: 'Array of project files' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectFileDto)
  files?: ProjectFileDto[];
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Updated Project Title', description: 'Project title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated short description', description: 'Short description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Updated full description...', description: 'Full description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of image URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [ProjectFileDto], description: 'Array of project files' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectFileDto)
  files?: ProjectFileDto[];
}
