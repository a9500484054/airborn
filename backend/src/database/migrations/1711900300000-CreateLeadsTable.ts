/**
 * Migration: Create Leads Table
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLeadsTable1711900300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['new', 'processed', 'closed'],
            default: "'new'",
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create index on email
    await queryRunner.createIndex(
      'leads',
      new TableIndex({
        name: 'IDX_LEADS_EMAIL',
        columnNames: ['email'],
      }),
    );

    // Create index on status
    await queryRunner.createIndex(
      'leads',
      new TableIndex({
        name: 'IDX_LEADS_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leads');
  }
}
