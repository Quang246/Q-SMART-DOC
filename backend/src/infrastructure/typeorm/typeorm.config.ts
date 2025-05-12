import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../repositories/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  entities: [UserEntity],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: true,
};
