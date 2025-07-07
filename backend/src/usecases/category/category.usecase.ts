import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/infrastructure/repositories/category.entity';
import { Document } from 'src/infrastructure/repositories/document.entity';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import { CreateCategory, EditCategory } from './dto/crud-category.dto';

@Injectable()
export class CategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(DocumentStatistic)
    private readonly documentStatisticRepo: Repository<DocumentStatistic>,
  ) {}

  async create(dto: CreateCategory): Promise<Category> {
    const cat = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(cat);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }
  async findOne(categoryId: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  async update(categoryId: number, dto: EditCategory): Promise<Category> {
    const updateResult = await this.categoryRepo.update(categoryId, dto);
    if (updateResult.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return this.findOne(categoryId);
  }

  async remove(categoryId: number): Promise<void> {
    const documents = await this.documentRepo.find({ where: { categoryId } });
    for (const doc of documents) {
      await this.documentStatisticRepo.delete({ document_id: doc.documentId });
    }
    await this.documentRepo.delete({ categoryId });
    await this.categoryRepo.delete(categoryId);
  }
}
