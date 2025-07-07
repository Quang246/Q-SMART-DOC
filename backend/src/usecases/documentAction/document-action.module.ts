import { Module } from '@nestjs/common';
import { DocumentController } from './document-action.controller';
import { DocumentUseCase } from './document-action.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/infrastructure/repositories/document.entity';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentStatistic])],
  controllers: [DocumentController],
  providers: [DocumentUseCase],
})
export class DocumentActionModule {}
