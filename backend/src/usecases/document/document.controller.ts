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
  Query,
  Delete,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
  async create(@Body() dto: CreateDocumentDto, @Request() req) {
    try {
      dto.createdBy = req.user.userId;
      // dto.createdAt = new Date();
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    try {
      const { data, totalCount } = await this.useCase.findAll(skip, take);

      // map để chỉ trả những trường cần thiết
      const mapped = data.map((doc) => ({
        documentId: doc.documentId,
        title: doc.title,
        author: doc.author,
        categoryId: doc.categoryId,
        filePath: doc.filePath,
        createdAt: doc.createdAt,
        createdBy: doc.createdBy,
        createdByUser: doc.createdByUser?.username || '',
      }));
      return {
        message: 'Lấy danh sách tài liệu thành công.',
        data: mapped,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize), // (tuỳ chọn)
        },
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
  @Get('getDocby')
  @ApiQuery({ name: 'categoryId', required: true, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findByQuery(
    @Query('categoryId') categoryId: number,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { data, totalCount } = await this.useCase.findDocByCat(
      +categoryId,
      title,
      author,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
      skip,
      take,
    );
    const mapped = data.map((doc) => ({
      documentId: doc.documentId,
      title: doc.title,
      author: doc.author,
      categoryId: doc.categoryId,
      filePath: doc.filePath,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy,
      createdByUser: doc.createdByUser?.username || '',
      updatedBy: doc.updatedBy,
      updatedAt: doc.updatedAt,
      updatedByUser: doc.updatedByUser?.username || '',
    }));
    return {
      message: 'Lấy danh sách tài liệu thành công.',
      data: mapped,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }
  @Post('updateDocby/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDocumentDto,
    @Request() req,
  ) {
    try {
      // Gán thông tin user cập nhật và thời gian cập nhật
      dto.updatedBy = req.user.userId;
      // dto.updatedAt = new Date();

      // Thực hiện cập nhật
      const updatedDoc = await this.useCase.update(id, dto);

      // Chuẩn bị dữ liệu trả về
      const doc = {
        documentId: updatedDoc.documentId,
        title: updatedDoc.title,
        author: updatedDoc.author,
        categoryId: updatedDoc.categoryId,
        filePath: updatedDoc.filePath,
        createdAt: updatedDoc.createdAt,
        createdBy: updatedDoc.createdBy,
        createdByUser: updatedDoc.createdByUser?.username || '',
        updatedAt: updatedDoc.updatedAt,
        updatedBy: updatedDoc.updatedBy,
        updatedByUser: updatedDoc.updatedByUser?.username || '',
      };

      return {
        message: `Cập nhật tài liệu với id ${updatedDoc.documentId} thành công.`,
        data: doc,
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
