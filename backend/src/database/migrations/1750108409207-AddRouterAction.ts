import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRouterAction1750108409207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('action');
    const hasColumn = table!.findColumnByName('router');

    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE action
        ADD COLUMN router VARCHAR(150) NULL;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE action
      DROP COLUMN router;
    `);
  }
}
