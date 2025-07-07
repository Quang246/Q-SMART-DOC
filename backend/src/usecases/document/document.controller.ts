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
  Logger,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentUseCase } from './document.usecase';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/crud-document.dto';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
// import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryInterceptor } from 'src/infrastructure/cloudinary/cloudinary.interceptor';
const logger = new Logger('DocumentController');
@ApiTags('Tài liệu')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly useCase: DocumentUseCase,
    private readonly configService: ConfigService,
  ) {}
  // @Post('createdoc')
  // @UseInterceptors(AnyFilesInterceptor())
  // async createDoc(@Body() body: any, @Request() req) {
  //   if (!body.filePath) {
  //     throw new HttpException(
  //       'Thiếu đường dẫn file tài liệu (filePath)',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const dto = plainToInstance(CreateDocumentDto, {
  //     ...body,
  //     categoryId: Number(body.categoryId),
  //     createdBy: req.user.userId,
  //   });

  //   await validateOrReject(dto);

  //   const doc = await this.useCase.create(dto);

  //   return {
  //     message: 'Tạo tài liệu thành công.',
  //     fileUrl: dto.filePath,
  //     data: doc,
  //   };
  // }
  @Post('createdoc')
  @UseInterceptors(CloudinaryInterceptor)
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    const createdDoc = await this.useCase.createWithFile(dto, file, userId); // 👈 truyền userId xuống

    return {
      data: createdDoc,
      message: `Tạo tài liệu thành công`,
    };
  }
  @Get('getAllDoc')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  async getAllDoc(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('title') title?: string,
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const { data, totalCount } = await this.useCase.findAll(skip, take, title);

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
      message: 'Lấy danh sách tất cả tài liệu thành công.',
      data: mapped,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
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
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
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
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  @Post('updateDocby/:id')
  @UseInterceptors(CloudinaryInterceptor)
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req,
  ) {
    try {
      if (!body.title) {
        throw new HttpException(
          'Tên tài liệu không được để trống.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!body.author) {
        throw new HttpException(
          'Tác giả không được để trống.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = plainToInstance(UpdateDocumentDto, {
        ...body,
        updatedBy: req.user.userId,
      });
      await validateOrReject(dto);

      const updatedDoc = await this.useCase.update(
        +id,
        dto,
        file,
        req.user.userId,
      );

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
      logger.error(`Cập nhật thất bại cho tài liệu id ${id}`, error.stack);

      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || `Cập nhật tài liệu với id ${id} thất bại.`,
          error: 'Lỗi dữ liệu hoặc không tìm thấy',
        },
        error.status || HttpStatus.BAD_REQUEST,
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
      logger.error(`Xóa thất bại cho tài liệu id ${id}`, error.stack);
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
  @Get('stats/file-types')
  async getFileTypeStats() {
    return this.useCase.getFileTypeStats();
  }
}
