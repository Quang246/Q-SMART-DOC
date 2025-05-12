import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSearchHistoryTable1714455000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE search_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userid INT,
        search_query VARCHAR(255) NOT NULL,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE search_history`);
  }
}
