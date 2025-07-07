import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleAction } from './role-action.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name', unique: true })
  roleName: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
  @OneToMany(() => RoleAction, (roleAction) => roleAction.role)
  roleActions: RoleAction[];
}
