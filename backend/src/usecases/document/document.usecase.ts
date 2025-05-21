import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/crud-document.dto';
// import { DocumentModel } from '../../domain/model/document';

@Injectable()
export class DocumentUseCase {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    const doc = this.documentRepo.create(dto);
    return await this.documentRepo.save(doc);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepo.find();
  }

  async findOne(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({ where: { documentId: id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: number, dto: UpdateDocumentDto): Promise<Document> {
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
