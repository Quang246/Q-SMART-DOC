import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ActionWithRoleUseCase } from './role-action.usecase';
import { UpdateActionRoleDto } from './dto/role-action.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('action-with-role')
export class ActionWithRoleController {
  constructor(private readonly useCase: ActionWithRoleUseCase) {}

  @Get()
  async getAll() {
    return this.useCase.getAllActionWithRoles();
  }

  @Put(':actionId')
  @ApiParam({ name: 'actionId', type: Number })
  @ApiBody({ type: UpdateActionRoleDto })
  async updateRoleForAction(
    @Param('actionId') actionId: number,
    @Body() body: UpdateActionRoleDto,
  ) {
    const { roleId, checked } = body;

    if (roleId !== 1 && roleId !== 2) {
      throw new BadRequestException('roleId phải là 1 hoặc 2');
    }

    return this.useCase.updateRoleForAction(actionId, roleId, checked);
  }
}
