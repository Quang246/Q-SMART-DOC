import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { Action } from './action.entity';

@Entity('role_action')
export class RoleAction {
  @PrimaryGeneratedColumn({ name: 'role_action_id' })
  roleActionId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role) => role.roleActions, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({ name: 'action_id' })
  actionId: number;

  @ManyToOne(() => Action, (action) => action.roleActions, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'action_id' })
  action: Action;
}
