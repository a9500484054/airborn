/**
 * AirBorn Backend - Main Entry Point
 * NestJS application bootstrap with security middleware and Swagger docs
 */
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix for API
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Auto-transform payloads
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global throttle guard - disabled for now
  // app.useGlobalGuards(new ThrottlerGuard([{ ttl: 60000, limit: 100 }], undefined, reflector));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Static files for uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AirBorn API')
    .setDescription('AirBorn platform API documentation')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description: 'Enter your JWT access token',
    })
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'JWT Refresh Token stored in httpOnly cookie',
    })
    .addTag('auth', 'Authentication and authorization endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('projects', 'Project CRUD endpoints')
    .addTag('messages', 'Chat messages endpoints')
    .addTag('leads', 'Lead management endpoints')
    .addTag('files', 'File upload and download endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'AirBorn API Docs',
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 AirBorn Backend is running!                  ║
  ║                                                   ║
  ║   Application:  http://localhost:${port}           ║
  ║   API Prefix:   /${apiPrefix}                        ║
  ║   Swagger:      http://localhost:${port}/docs      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
}

bootstrap();
