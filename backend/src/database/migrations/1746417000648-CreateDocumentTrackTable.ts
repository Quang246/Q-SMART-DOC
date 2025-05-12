import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentTrackTable1746417000648
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE document_views (
                  id INT PRIMARY KEY AUTO_INCREMENT,
                  userid INT,
                  docid INT,
                  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
                  FOREIGN KEY (docid) REFERENCES documents(docid) ON DELETE CASCADE
                );
              `);

    await queryRunner.query(`
                CREATE TABLE document_downloads (
                  id INT PRIMARY KEY AUTO_INCREMENT,
                  userid INT,
                  docid INT,
                  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
                  FOREIGN KEY (docid) REFERENCES documents(docid) ON DELETE CASCADE
                );
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE document_downloads`);
    await queryRunner.query(`DROP TABLE document_views`);
  }
}
