import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocTable1747740954471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xoá cột không dùng nữa
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP COLUMN \`publish_year\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP COLUMN \`file_format\``,
    );

    // Thêm cột mới: created_by
    await queryRunner.query(
      `ALTER TABLE \`document\` ADD \`created_by\` INT NULL`,
    );

    // Tạo foreign key tới bảng user
    await queryRunner.query(`
          ALTER TABLE \`document\`
          ADD CONSTRAINT \`FK_document_user\`
          FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`userid\`)
          ON DELETE SET NULL
          ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xoá foreign key
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_document_user\``,
    );

    // Xoá cột created_by
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP COLUMN \`created_by\``,
    );

    // Thêm lại các cột đã xoá (nếu cần rollback)
    await queryRunner.query(
      `ALTER TABLE \`document\` ADD \`publish_year\` INT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` ADD \`file_format\` VARCHAR(10)`,
    );
  }
}
