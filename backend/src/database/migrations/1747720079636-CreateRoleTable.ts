import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1747720079636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`role\` (
            \`role_id\` INT NOT NULL AUTO_INCREMENT,
            \`role_name\` VARCHAR(50) NOT NULL,
            PRIMARY KEY (\`role_id\`),
            UNIQUE INDEX \`IDX_role_name\` (\`role_name\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
