import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { UserEntity } from './user.entity';

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn({ name: 'document_id' }) // 👈 sửa ở đây
  documentId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'author', nullable: true })
  author: string;

  @Column({ name: 'category_id' })
  categoryId: number;
  @ManyToOne(() => Category, (category) => category.documents, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
