import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from 'src/infrastructure/repositories/action.entity';
import { RoleEntity } from 'src/infrastructure/repositories/role.entity';
import { RoleAction } from 'src/infrastructure/repositories/role-action.entity';

@Injectable()
export class ActionWithRoleUseCase {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(RoleAction)
    private readonly roleActionRepository: Repository<RoleAction>,
  ) {}

  async getAllActionWithRoles() {
    const actions = await this.actionRepository.find({
      relations: ['roleActions', 'roleActions.role'],
    });

    const roles = await this.roleRepository.find();

    return actions.map((action) => {
      const grantedRoles = new Set(
        action.roleActions.map((ra) => ra.role.roleId),
      );

      return {
        actionId: action.actionId,
        actionName: action.actionName,
        description: action.description,
        router: action.router,
        roles: roles.map((role) => ({
          roleId: role.roleId,
          roleName: role.roleName,
          checked: grantedRoles.has(role.roleId),
        })),
      };
    });
  }

  async updateRoleForAction(
    actionId: number,
    roleId: number,
    checked: boolean,
  ) {
    if (checked) {
      const exists = await this.roleActionRepository.findOne({
        where: { action: { actionId }, role: { roleId } },
      });

      if (!exists) {
        const newRoleAction = this.roleActionRepository.create({
          action: { actionId },
          role: { roleId },
        });
        await this.roleActionRepository.save(newRoleAction);
      }

      if (roleId === 2) {
        const existsRole1 = await this.roleActionRepository.findOne({
          where: { action: { actionId }, role: { roleId: 1 } },
        });
        if (!existsRole1) {
          const newRole1 = this.roleActionRepository.create({
            action: { actionId },
            role: { roleId: 1 },
          });
          await this.roleActionRepository.save(newRole1);
        }
      }

      return {
        message: `Đã cấp quyền thành công`,
      };
    } else {
      await this.roleActionRepository.delete({
        action: { actionId },
        role: { roleId },
      });

      return {
        message: `Đã thu hồi quyền thành công`,
      };
    }
  }
}
