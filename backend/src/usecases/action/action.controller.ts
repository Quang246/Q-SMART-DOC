/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Request,
  HttpException,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActionUseCase } from './action.usecase';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';
import {
  CreateActionDto,
  ActionResponseDto,
  UpdateActionDto,
} from './dto/action.dto';

@ApiTags('Action')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('Actions')
export class ActionController {
  constructor(private readonly useCase: ActionUseCase) {}

  @Post('createAction')
  async create(@Body() dto: CreateActionDto, @Request() req) {
    dto.createdBy = req.user.userId;
    const createdAction = await this.useCase.create(dto);
    return {
      message: 'Tạo chức năng thành công.',
      data: createdAction,
    };
  }

  @Get('getAllAction')
  @ApiResponse({ status: 200, type: [ActionResponseDto] })
  async findAll() {
    try {
      const data = await this.useCase.findAll();
      const mapped = data.map((action) => ({
        actionId: action.actionId,
        actionName: action.actionName,
        description: action.description,
        router: action.router,
        createdDate: action.createdDate,
        createdBy: action.createdBy,
        createdByUser: action.createdByUser?.username || '',
        updatedDate: action.updatedDate,
        updatedBy: action.updatedBy,
        updatedByUser: action.updatedByUser?.username || '',
      }));

      return {
        message: 'Lấy danh sách chức năng thành công.',
        data: mapped,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Lấy danh sách chức năng thất bại.',
          error: 'Lỗi máy chủ nội bộ',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('updateby/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateActionDto,
    @Request() req,
  ) {
    try {
      dto.updatedBy = req.user.userId;
      const updatedAction = await this.useCase.update(id, dto);
      const action = {
        actionId: updatedAction.actionId,
        actionName: updatedAction.actionName,
        description: updatedAction.description,
        createdDate: updatedAction.createdDate,
        createdBy: updatedAction.createdBy,
        createdByUser: updatedAction.createdByUser?.username || '',
        updatedDate: updatedAction.updatedDate,
        updatedBy: updatedAction.updatedBy,
        updatedByUser: updatedAction.updatedByUser?.username || '',
      };

      return {
        message: `Cập nhật thành công.`,
        data: action,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.NOT_FOUND,
          message: error.message || `Cập nhật tài liệu với id ${id} thất bại.`,
          error: 'Không tìm thấy',
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
  @Delete('deleteby/:id')
  async remove(@Param('id') actionId: number) {
    try {
      await this.useCase.remove(actionId);
      return {
        message: `Xóa chức năng thành công.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || `Xóa chức năng thất bại.`,
          error: error.error || 'Lỗi máy chủ nội bộ',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
