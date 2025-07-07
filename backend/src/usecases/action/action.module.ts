import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/infrastructure/repositories/action.entity';
import { UserEntity } from '../../infrastructure/repositories/user.entity';
import { RoleEntity } from 'src/infrastructure/repositories/role.entity';
import { RoleAction } from 'src/infrastructure/repositories/role-action.entity';
import { ActionUseCase } from './action.usecase';
import { ActionController } from './action.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, UserEntity, RoleEntity, RoleAction]),
    JwtServiceModule,
  ],
  controllers: [ActionController],
  providers: [ActionUseCase],
})
export class ActionModule {}
