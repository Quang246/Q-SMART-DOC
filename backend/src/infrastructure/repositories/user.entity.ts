import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RoleEntity } from './role.entity';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'userid' })
  userId: number;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'email', unique: true })
  email: string;
  @Exclude()
  @Column({ name: 'password', type: 'text' })
  password: string;
  @Exclude()
  @Column({ name: 'role_id' }) // thêm dòng này
  roleId: number;
  @ManyToOne(() => RoleEntity, { eager: true }) // eager giúp tự động join role
  @JoinColumn({ name: 'role_id' }) // mapping đúng foreign key
  role: RoleEntity;
  @CreateDateColumn({
    name: 'createdate',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdate: Date;

  @UpdateDateColumn({
    name: 'updateddate',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedDate: Date;
  @Exclude()
  @Column({
    name: 'hash_refresh_token',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  hash_refresh_token: string | null;
}
