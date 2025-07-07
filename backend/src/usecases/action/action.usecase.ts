import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from 'src/infrastructure/repositories/action.entity';
import { CreateActionDto, UpdateActionDto } from './dto/action.dto';
import { UserEntity } from 'src/infrastructure/repositories/user.entity';
import { RoleAction } from 'src/infrastructure/repositories/role-action.entity';
import { RoleEntity } from 'src/infrastructure/repositories/role.entity';
@Injectable()
export class ActionUseCase {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(RoleAction)
    private readonly roleActionRepo: Repository<RoleAction>,
  ) {}

  async create(dto: CreateActionDto): Promise<Action> {
    const action = this.actionRepo.create(dto);
    const savedAction = await this.actionRepo.save(action);
    const role = await this.roleRepo.findOne({ where: { roleId: 1 } });
    if (role) {
      const roleAction = this.roleActionRepo.create({
        role: role,
        action: savedAction,
      });
      await this.roleActionRepo.save(roleAction);
    }

    return savedAction;
  }
  async findAll(): Promise<Action[]> {
    const data = await this.actionRepo.find({
      relations: ['createdByUser'],
      order: { createdDate: 'DESC' },
    });
    return data;
  }

  async findOne(actionId: number): Promise<Action> {
    const action = await this.actionRepo.findOne({
      where: { actionId: actionId },
    });
    if (!action) throw new NotFoundException('Action not found');
    return action;
  }
  async update(id: number, dto: UpdateActionDto): Promise<Action> {
    const updateResult = await this.actionRepo.update(id, {
      ...dto,
      updatedDate: new Date(),
    });

    if (updateResult.affected === 0) {
      throw new NotFoundException('Action not found');
    }

    return this.findOne(id);
  }

  async remove(actionId: number): Promise<void> {
    await this.roleActionRepo.delete({ actionId });
    const deleteResult = await this.actionRepo.delete({ actionId });
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Action not found');
    }
  }
}
