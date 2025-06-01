import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtToDocument1747743447383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE document
          ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE document
          DROP COLUMN created_at
        `);
  }
}
