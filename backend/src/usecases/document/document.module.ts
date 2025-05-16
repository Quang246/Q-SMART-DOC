import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { DocumentUseCase } from './document.usecase';
import { DocumentController } from './document.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), JwtServiceModule],
  controllers: [DocumentController],
  providers: [DocumentUseCase],
})
export class DocumentModule {}
