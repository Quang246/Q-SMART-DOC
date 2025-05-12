import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { DocumentUseCase } from './document.usecase';
import { DocumentController } from './document.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DocumentController],
  providers: [DocumentUseCase],
})
export class DocumentModule {}
