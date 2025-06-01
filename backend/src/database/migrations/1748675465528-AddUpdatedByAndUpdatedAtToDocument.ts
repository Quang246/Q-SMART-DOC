import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedByAndUpdatedAtToDocument1748675465528
  implements MigrationInterface
{
  name = 'AddUpdatedByAndUpdatedAtToDocument';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE document
        ADD COLUMN updated_by INT DEFAULT NULL,
        ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        ADD CONSTRAINT FK_document_updated_user FOREIGN KEY (updated_by) REFERENCES user(userid) ON DELETE SET NULL ON UPDATE CASCADE
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE document
        DROP FOREIGN KEY FK_document_updated_user,
        DROP COLUMN updated_by,
        DROP COLUMN updated_at
      `);
  }
}
