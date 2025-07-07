import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from './document.entity';
@Entity('document_statistic')
export class DocumentStatistic {
  @PrimaryGeneratedColumn({ name: 'stat_id' })
  stat_id: number;

  @Column()
  user_id: number;

  @Column()
  document_id: number;

  @Column()
  action_type: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  action_time: Date;

  @Column({ nullable: true })
  ip_address: string;
  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
