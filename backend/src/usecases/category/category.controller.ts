/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
//   import { DocumentUseCase } from './document.usecase';
import { CategoryUseCase } from './category.usecase';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';
import { CreateCategory, CategoryResponseDto } from './dto/crud-category.dto';
@ApiTags('Category')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('categoris')
export class CategoryController {
  constructor(private readonly useCase: CategoryUseCase) {}
  @Post('createCategory')
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  async create(@Body() dto: CreateCategory) {
    try {
      const createdCat = await this.useCase.create(dto);
      return {
        statusCode: 201,
        message: 'Tạo chuyên mục thành công',
        data: createdCat,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên chuyên mục đã tồn tại');
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
  @Get('getAllCategory')
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async findAll() {
    try {
      const cats = await this.useCase.findAll();

      return {
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách chuyên mục thành công.',
        data: cats,
      };
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Lỗi truy vấn dữ liệu.',
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Lỗi máy chủ nội bộ.',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('deleteCatby/:categoryId')
  async remove(@Param('categoryId') categoryId: number) {
    try {
      await this.useCase.remove(+categoryId);
      return {
        statusCode: HttpStatus.OK,
        message: `Xóa tài liệu thành công.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.NOT_FOUND,
          message: error.message || `Xóa tài liệu thất bại.`,
          error: 'Không tìm thấy',
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
