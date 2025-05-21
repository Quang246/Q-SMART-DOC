import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentTable1747720326379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`document\` (
            \`document_id\` INT NOT NULL AUTO_INCREMENT,
            \`title\` VARCHAR(255) NOT NULL,
            \`author\` VARCHAR(100),
            \`category_id\` INT NOT NULL,
            \`publish_year\` INT,
            \`file_format\` VARCHAR(10),
            \`file_path\` VARCHAR(500),
            PRIMARY KEY (\`document_id\`),
            CONSTRAINT \`FK_document_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`category_id\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`document\``);
  }
}
