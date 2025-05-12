import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentTable1746536194170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`documents\` (
            \`docid\` INT PRIMARY KEY AUTO_INCREMENT,
            \`docname\` VARCHAR(255) NOT NULL,
            \`author\` VARCHAR(100),
            \`category\` VARCHAR(100),
            \`file_path\` VARCHAR(255) NOT NULL,
            \`created_by\` INT,
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`userid\`) ON DELETE SET NULL
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`documents\``);
  }
}
