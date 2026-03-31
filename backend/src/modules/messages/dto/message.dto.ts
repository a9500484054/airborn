/**
 * Messages DTOs
 * Data Transfer Objects for message operations
 */
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiPropertyOptional({ description: 'Message content (required if no fileUrl)' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @ApiPropertyOptional({ description: 'File URL (required if no content)' })
  @IsOptional()
  @IsUrl()
  fileUrl?: string;

  @ApiPropertyOptional({ description: 'File type (image/jpeg, application/pdf, etc.)' })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiPropertyOptional({ description: 'ID of message being replied to' })
  @IsOptional()
  @IsUUID()
  replyToId?: string;
}

export class SearchMessagesDto {
  @ApiProperty({ description: 'Search query' })
  @IsNotEmpty()
  @IsString()
  query: string;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, example: 20 })
  @IsOptional()
  limit?: number = 20;
}
