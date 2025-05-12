import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  docid: number;

  @Column()
  docname: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  category: string;

  @Column()
  file_path: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserEntity;
}
