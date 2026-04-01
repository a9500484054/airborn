/**
 * Files Controller
 * Handles HTTP requests for file operations
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Res,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { FilesService, UploadedFile } from './files.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload one or multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 20 files, 20MB each)',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = process.env.UPLOAD_PATH || '/app/uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles: UploadedFile[] = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      name: Buffer.from(file.originalname, 'latin1').toString('utf-8'),
      size: file.size,
      mimeType: file.mimetype,
    }));

    return {
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download file by ID' })
  @ApiParam({ name: 'id', type: String, description: 'File ID (filename)' })
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const fs = require('fs');
    const filePath = this.filesService.getFilePath(id);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiParam({ name: 'id', type: String, description: 'File ID (filename)' })
  async deleteFile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.filesService.deleteFile(id, user.id, user.role);
    return { message: 'File deleted successfully' };
  }
}
