import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Document } from './document.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'category_name', type: 'varchar', length: 100, unique: true })
  categoryName: string;

  // Khóa ngoại: parent_id trỏ tới category cha
  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  // Quan hệ ngược: danh sách category con
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // Một category có thể có nhiều documents
  @OneToMany(() => Document, (document) => document.categoryId)
  documents: Document[];
}
