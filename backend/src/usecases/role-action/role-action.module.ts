import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/infrastructure/repositories/action.entity';
import { RoleEntity } from 'src/infrastructure/repositories/role.entity';
import { RoleAction } from 'src/infrastructure/repositories/role-action.entity';
import { ActionWithRoleController } from './role-action.controller';
import { ActionWithRoleUseCase } from './role-action.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Action, RoleEntity, RoleAction])],
  controllers: [ActionWithRoleController],
  providers: [ActionWithRoleUseCase],
})
export class ActionWithRoleModule {}
