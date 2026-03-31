/**
 * Migration: Create Messages Table
 */
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateMessagesTable1711900200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
            isPrimary: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'fileUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'fileType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'replyToId',
            type: 'uuid',
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

    // Create foreign key to users
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        name: 'FK_MESSAGES_USER',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for reply (self-reference)
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        name: 'FK_MESSAGES_REPLY',
        columnNames: ['replyToId'],
        referencedTableName: 'messages',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Create index on userId
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_MESSAGES_USER',
        columnNames: ['userId'],
      }),
    );

    // Create index on createdAt for ordering
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_MESSAGES_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('messages');
    if (table) {
      const userForeignKey = table.foreignKeys.find(fk => fk.name === 'FK_MESSAGES_USER');
      if (userForeignKey) {
        await queryRunner.dropForeignKey('messages', userForeignKey);
      }

      const replyForeignKey = table.foreignKeys.find(fk => fk.name === 'FK_MESSAGES_REPLY');
      if (replyForeignKey) {
        await queryRunner.dropForeignKey('messages', replyForeignKey);
      }
    }
    await queryRunner.dropTable('messages');
  }
}
