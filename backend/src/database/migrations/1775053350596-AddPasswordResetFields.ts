import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetFields1775053350596 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD "passwordResetToken" varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD "passwordResetTokenExpires" timestamp NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "passwordResetToken"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "passwordResetTokenExpires"
        `);
    }

}
