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
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentUseCase } from './document.usecase';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';

import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from './dto/crud-document.dto';

@ApiTags('Tài liệu')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly useCase: DocumentUseCase) {}

  @Post('createdoc')
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async create(@Body() dto: CreateDocumentDto) {
    try {
      const createdDoc = await this.useCase.create(dto);
      return {
        message: 'Tạo tài liệu thành công.',
        data: createdDoc,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Tạo tài liệu thất bại.',
          error: 'Yêu cầu không hợp lệ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getAllDoc')
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  async findAll() {
    try {
      const docs = await this.useCase.findAll();
      return {
        message: 'Lấy danh sách tài liệu thành công.',
        data: docs,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Lấy danh sách tài liệu thất bại.',
          error: 'Lỗi máy chủ nội bộ',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getDocby/:id')
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  async findOne(@Param('id') id: number) {
    try {
      const doc = await this.useCase.findOne(+id);
      return {
        message: `Lấy tài liệu với id ${id} thành công.`,
        data: doc,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.NOT_FOUND,
          message: error.message || `Không tìm thấy tài liệu với id: ${id}.`,
          error: 'Không tìm thấy',
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('updateDocby/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateDocumentDto) {
    try {
      const updatedDoc = await this.useCase.update(+id, dto);
      return {
        message: `Cập nhật tài liệu với id ${id} thành công.`,
        data: updatedDoc,
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

  @Delete('deleteDocby/:id')
  async remove(@Param('id') id: number) {
    try {
      await this.useCase.remove(+id);
      return {
        message: `Xóa tài liệu với id ${id} thành công.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.NOT_FOUND,
          message: error.message || `Xóa tài liệu với id ${id} thất bại.`,
          error: 'Không tìm thấy',
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
