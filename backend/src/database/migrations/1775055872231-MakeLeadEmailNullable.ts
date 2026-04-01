import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeLeadEmailNullable1775055872231 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "leads" 
            ALTER COLUMN "email" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "leads" 
            ALTER COLUMN "email" SET NOT NULL
        `);
    }

}
