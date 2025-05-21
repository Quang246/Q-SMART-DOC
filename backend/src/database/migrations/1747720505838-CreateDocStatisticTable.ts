import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocStatisticTable1747720505838
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE \`document_statistic\` (
            \`stat_id\` INT NOT NULL AUTO_INCREMENT,
            \`user_id\` INT NOT NULL,
            \`document_id\` INT NOT NULL,
            \`action_type\` VARCHAR(20) NOT NULL,  -- 'view' hoặc 'download'
            \`action_time\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`ip_address\` VARCHAR(45),
            PRIMARY KEY (\`stat_id\`),
            CONSTRAINT \`FK_stat_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`userid\`),
            CONSTRAINT \`FK_stat_document\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`document_id\`)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`document_statistic\``);
  }
}
