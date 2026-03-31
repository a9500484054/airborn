/**
 * Корневой модуль приложения
 * Импортирует и настраивает все функциональные модули
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MessagesModule } from './modules/messages/messages.module';
import { LeadsModule } from './modules/leads/leads.module';
import { FilesModule } from './modules/files/files.module';
import { WebsocketModule } from './websocket/websocket.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // Модуль конфигурации
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'postgres',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_DATABASE') || 'airborn',
        autoLoadEntities: true,
        synchronize: true, // Use synchronize for development
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL') || 60,
            limit: configService.get<number>('THROTTLE_LIMIT') || 100,
          },
        ],
      }),
    }),

    // Модули функциональности
    AuthModule,
    UsersModule,
    ProjectsModule,
    MessagesModule,
    LeadsModule,
    FilesModule,
    WebsocketModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
