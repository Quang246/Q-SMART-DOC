import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRoleDefault1747723060304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              ALTER TABLE \`user\` 
              MODIFY \`role_id\` INT NOT NULL DEFAULT 2
            `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              ALTER TABLE \`user\` 
              MODIFY \`role_id\` INT NOT NULL
            `);
  }
}
