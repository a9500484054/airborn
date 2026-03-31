/**
 * Migration: Create Projects Table
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProjectsTable1711900100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'shortDescription',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'images',
            type: 'jsonb',
            default: "'[]'::jsonb",
          },
          {
            name: 'files',
            type: 'jsonb',
            default: "'[]'::jsonb",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create index on title for search
    await queryRunner.createIndex(
      'projects',
      new TableIndex({
        name: 'IDX_PROJECTS_TITLE',
        columnNames: ['title'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('projects');
  }
}
