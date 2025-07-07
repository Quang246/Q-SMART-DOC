import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionTable1747720387245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`action\` (
            \`action_id\` INT NOT NULL AUTO_INCREMENT,
            \`action_name\` VARCHAR(100) NOT NULL,
            \`description\` VARCHAR(255),
            PRIMARY KEY (\`action_id\`),
            UNIQUE INDEX \`IDX_action_name\` (\`action_name\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`action\``);
  }
}
