import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentIdToCategory1747731142490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE \`category\`
          ADD COLUMN \`parent_id\` INT NULL,
          ADD CONSTRAINT \`FK_category_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`category\`(\`category_id\`) ON DELETE SET NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE \`category\`
          DROP FOREIGN KEY \`FK_category_parent\`,
          DROP COLUMN \`parent_id\`;
        `);
  }
}
