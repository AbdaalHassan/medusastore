import { MigrationInterface, QueryRunner } from "typeorm";

export class FaqMigration1694418312306 implements MigrationInterface {
    name = 'FaqMigration1694418312306'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE "faq" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "question" character varying NOT NULL, "answer" character varying NOT NULL, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1956813f611e3bf038f6b61a61" ON "faq" ("question") `);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
               await queryRunner.query(`DROP TABLE "faq"`);
  
    }

}
