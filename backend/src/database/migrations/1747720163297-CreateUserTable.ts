import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1747720163297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`user\` (
            \`userid\` INT NOT NULL AUTO_INCREMENT,
            \`username\` VARCHAR(255) NOT NULL,
            \`email\` VARCHAR(50) NOT NULL,
            \`password\` TEXT NOT NULL,
            \`role_id\` INT NOT NULL,
            \`createdate\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updateddate\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`hash_refresh_token\` VARCHAR(255) NULL,
            PRIMARY KEY (\`userid\`),
            UNIQUE INDEX \`IDX_username\` (\`username\`),
            CONSTRAINT \`FK_user_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`role_id\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
