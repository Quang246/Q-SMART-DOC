import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTable1747720288362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`category\` (
            \`category_id\` INT NOT NULL AUTO_INCREMENT,
            \`category_name\` VARCHAR(100) NOT NULL,
            PRIMARY KEY (\`category_id\`),
            UNIQUE INDEX \`IDX_category_name\` (\`category_name\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
