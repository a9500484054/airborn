import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateReportsTable1775056000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'object',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'hours',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'userId',
            type: 'uuid',
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'reports',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reports');
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('userId'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('reports', foreignKey);
    }
    await queryRunner.dropTable('reports');
  }
}
