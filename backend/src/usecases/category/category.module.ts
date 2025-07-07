import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/infrastructure/repositories/category.entity';
import { Document } from 'src/infrastructure/repositories/document.entity';
import { CategoryUseCase } from './category.usecase';
import { CategoryController } from './category.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Document, DocumentStatistic]),
    JwtServiceModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryUseCase],
})
export class CategoryModule {}
