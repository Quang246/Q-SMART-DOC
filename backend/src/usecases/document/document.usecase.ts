import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, Like } from 'typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/crud-document.dto';
import { UserEntity } from 'src/infrastructure/repositories/user.entity';
import { extname } from 'path';
// import { DocumentModel } from '../../domain/model/document';
@Injectable()
export class DocumentUseCase {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    const allowedExtensions = ['.doc', '.docx', '.pdf'];
    const fileExt = extname(dto.filePath).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Định dạng file không hợp lệ!');
    }
    const doc = this.documentRepo.create(dto);
    return await this.documentRepo.save(doc);
  }

  async findAll(
    skip = 0,
    take = 10,
  ): Promise<{ data: Document[]; totalCount: number }> {
    const [data, totalCount] = await this.documentRepo.findAndCount({
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
  async update(id: number, dto: UpdateDocumentDto): Promise<Document> {
    const allowedExtensions = ['.doc', '.docx', '.pdf'];
    const fileExt = extname(dto.filePath).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Định dạng file không hợp lệ!');
    }
    const updateResult = await this.documentRepo.update(id, dto);
    if (updateResult.affected === 0) {
      throw new NotFoundException('Document not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.documentRepo.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Document not found');
    }
  }
}
