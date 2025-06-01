import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'category_name', type: 'varchar', length: 100, unique: true })
  categoryName: string;

  @Column({ name: 'parent_id' })
  parentId: number;

  // Một category có thể có nhiều documents
  @OneToMany(() => Document, (document) => document.categoryId)
  documents: Document[];
}
