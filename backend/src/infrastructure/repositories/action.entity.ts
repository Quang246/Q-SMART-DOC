import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleAction } from './role-action.entity';

@Entity('action')
export class Action {
  @PrimaryGeneratedColumn({ name: 'action_id' })
  actionId: number;

  @Column({ name: 'action_name', type: 'varchar', length: 100, unique: true })
  actionName: string;

  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'router', type: 'varchar', length: 150, nullable: true })
  router: string;
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserEntity;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserEntity;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'datetime', nullable: true, name: 'updated_date' })
  updatedDate: Date;

  @OneToMany(() => RoleAction, (roleAction) => roleAction.action)
  roleActions: RoleAction[];
}
