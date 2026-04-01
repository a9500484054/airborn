/**
 * Files Service
 * Handles file upload, download, and deletion
 */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, basename } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class FilesService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ],
  };

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH') || '/app/uploads';
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE') || 20 * 1024 * 1024; // 20MB

    // Ensure upload directory exists
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Check MIME type
    const allAllowedTypes = [
      ...this.allowedMimeTypes.images,
      ...this.allowedMimeTypes.documents,
    ];

    if (!allAllowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: images (jpg, png, gif, webp), documents (pdf, doc, docx, xls, xlsx, txt)`,
      );
    }
  }

  /**
   * Get file category
   */
  getFileCategory(mimeType: string): 'image' | 'document' | 'other' {
    if (this.allowedMimeTypes.images.includes(mimeType)) {
      return 'image';
    }
    if (this.allowedMimeTypes.documents.includes(mimeType)) {
      return 'document';
    }
    return 'other';
  }

  /**
   * Upload file
   */
  uploadFile(file: Express.Multer.File): UploadedFile {
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(this.uploadPath, uniqueFilename);

    // Move file to upload directory
    const fs = require('fs');
    fs.writeFileSync(filePath, file.buffer);

    // Return file info
    return {
      url: `/uploads/${uniqueFilename}`,
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Upload multiple files
   */
  uploadFiles(files: Express.Multer.File[]): UploadedFile[] {
    return files.map((file) => this.uploadFile(file));
  }

  /**
   * Delete file
   */
  deleteFile(filePath: string, userId: string, userRole: string): void {
    const fileName = basename(filePath);
    const fullPath = join(this.uploadPath, fileName);

    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    // Only admins or file owners can delete (ownership tracking would need to be implemented)
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can delete files');
    }

    unlinkSync(fullPath);
  }

  /**
   * Get file path
   */
  getFilePath(fileName: string): string {
    return join(this.uploadPath, fileName);
  }
}
