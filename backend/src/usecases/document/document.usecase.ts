import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/crud-document.dto';
import { DocumentModel } from '../../domain/model/document';

@Injectable()
export class DocumentUseCase {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
  ) {}

  async create(dto: CreateDocumentDto): Promise<DocumentModel> {
    const doc = this.documentRepo.create(dto);
    const saved = await this.documentRepo.save(doc);
    return saved;
  }

  async findAll(): Promise<DocumentModel[]> {
    return this.documentRepo.find();
  }

  async findOne(id: number): Promise<DocumentModel> {
    const doc = await this.documentRepo.findOne({ where: { docid: id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: number, dto: UpdateDocumentDto): Promise<DocumentModel> {
    await this.documentRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.documentRepo.delete(id);
  }
}
