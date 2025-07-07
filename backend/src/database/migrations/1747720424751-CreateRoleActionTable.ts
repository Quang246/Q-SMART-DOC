import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleActionTable1747720424751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`role_action\` (
            \`role_action_id\` INT NOT NULL AUTO_INCREMENT,
            \`role_id\` INT NOT NULL,
            \`action_id\` INT NOT NULL,
            PRIMARY KEY (\`role_action_id\`),
            UNIQUE INDEX \`IDX_role_action_unique\` (\`role_id\`, \`action_id\`),
            CONSTRAINT \`FK_role_action_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`role_id\`),
            CONSTRAINT \`FK_role_action_action\` FOREIGN KEY (\`action_id\`) REFERENCES \`action\`(\`action_id\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`role_action\``);
  }
}
