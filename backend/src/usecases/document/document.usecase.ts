/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, Like, ILike } from 'typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/crud-document.dto';
import { UserEntity } from 'src/infrastructure/repositories/user.entity';
import { extname } from 'path';
// import cloudinary from 'src/infrastructure/cloudinary/cloudinary.config';
// import { DocumentModel } from '../../domain/model/document';
@Injectable()
export class DocumentUseCase {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(DocumentStatistic)
    private readonly documentStatisticRepo: Repository<DocumentStatistic>,
  ) {}

  // async create(dto: CreateDocumentDto): Promise<Document> {
  //   const allowedExtensions = ['.doc', '.docx', '.pdf'];
  //   const fileExt = extname(dto.filePath!).toLowerCase();

  //   if (!allowedExtensions.includes(fileExt)) {
  //     throw new BadRequestException('Định dạng file không hợp lệ!');
  //   }
  //   const doc = this.documentRepo.create(dto);
  //   return await this.documentRepo.save(doc);
  // }
  async createWithFile(
    dto: CreateDocumentDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<Document> {
    if (!file || !file.path) {
      throw new BadRequestException('Tải lên file thất bại!');
    }
    const doc = this.documentRepo.create({
      ...dto,
      filePath: file.path,
      createdBy: userId,
    });
    return await this.documentRepo.save(doc);
  }
  async findAll(
    skip = 0,
    take = 10,
    searchText?: string,
  ): Promise<{ data: Document[]; totalCount: number }> {
    const whereClause = searchText ? { title: ILike(`%${searchText}%`) } : {};

    const [data, totalCount] = await this.documentRepo.findAndCount({
      where: whereClause,
      relations: ['createdByUser'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, totalCount };
  }

  async findOne(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({ where: { documentId: id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async findDocByCat(
    categoryId: number,
    title?: string,
    author?: string,
    fromDate?: Date,
    toDate?: Date,
    skip = 0,
    take = 10,
  ): Promise<{ data: Document[]; totalCount: number }> {
    const where: FindOptionsWhere<Document> = { categoryId };
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (author) {
      where.author = Like(`%${author}%`);
    }
    if (fromDate && toDate) {
      where.createdAt = Between(fromDate, toDate);
    } else if (fromDate) {
      where.createdAt = Between(fromDate, new Date());
    }
    const [data, totalCount] = await this.documentRepo.findAndCount({
      where,
      relations: ['createdByUser'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    if (!data.length) {
      throw new NotFoundException('Không tìm thấy tài liệu nào');
    }
    return { data, totalCount };
  }
  async update(
    id: number,
    dto: UpdateDocumentDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<Document> {
    const allowedExtensions = ['.doc', '.docx', '.pdf'];
    const pathToCheck = file?.path || dto.filePath;
    if (!pathToCheck) {
      throw new BadRequestException('Không có đường dẫn file hợp lệ.');
    }
    const fileExt = extname(pathToCheck).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Định dạng file không hợp lệ!');
    }

    const updatedData: Partial<Document> = {
      ...dto,
      filePath: file?.path || dto.filePath, // Ưu tiên file mới nếu có
      updatedBy: userId,
    };

    const updateResult = await this.documentRepo.update(id, updatedData);

    if (updateResult.affected === 0) {
      throw new NotFoundException('Document not found');
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.documentStatisticRepo.delete({ document_id: id });
    const deleteResult = await this.documentRepo.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException('Document not found');
    }
  }
  async getFileTypeStats(): Promise<{ type: string; count: number }[]> {
    const result = await this.documentRepo.query(`
      SELECT
        CASE
          WHEN LOWER(SUBSTRING_INDEX(file_path, '.', -1)) = 'pdf' THEN 'PDF'
          WHEN LOWER(SUBSTRING_INDEX(file_path, '.', -1)) IN ('doc', 'docx') THEN 'DOC/DOCX'
          ELSE 'Khác'
        END AS type,
        COUNT(*) AS count
      FROM document
      GROUP BY type;
    `);
    return result;
  }
}
