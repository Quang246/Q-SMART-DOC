import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'userid' })
  userId: number;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', type: 'text' })
  password: string;

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
  updateddate: Date;
  @Column({ default: 'user' }) // hoặc bạn có thể để giá trị mặc định là 'user'
  role: string;
  @Column({
    name: 'hash_refresh_token',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  hash_refresh_token: string | null;
}
