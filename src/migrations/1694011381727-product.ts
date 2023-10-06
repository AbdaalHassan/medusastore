import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1694011381727 implements MigrationInterface {
    name = 'Product1694011381727'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "product" ADD "customAttribute" character varying`);
   
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customAttribute"`);
        }

}
