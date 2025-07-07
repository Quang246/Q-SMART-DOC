import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { UserEntity } from './user.entity';

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn({ name: 'document_id' })
  documentId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'author', nullable: true })
  author: string;

  @Column({ name: 'category_id' })
  categoryId: number;
  @ManyToOne(() => Category, (category) => category.documents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserEntity;
  @Column({ name: 'created_by', nullable: true })
  createdBy: number;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserEntity;
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
