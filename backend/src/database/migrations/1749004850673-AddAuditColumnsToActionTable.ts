import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditColumnsToActionTable1749004850673
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD COLUMN \`created_by\` INT DEFAULT NULL
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD COLUMN \`created_date\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD COLUMN \`updated_by\` INT DEFAULT NULL
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD COLUMN \`updated_date\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD CONSTRAINT \`FK_action_created_by\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`userid\`)
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\`
          ADD CONSTRAINT \`FK_action_updated_by\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`userid\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_action_created_by\`
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_action_updated_by\`
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP COLUMN \`created_by\`
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP COLUMN \`created_date\`
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP COLUMN \`updated_by\`
        `);
    await queryRunner.query(`
          ALTER TABLE \`action\` DROP COLUMN \`updated_date\`
        `);
  }
}
