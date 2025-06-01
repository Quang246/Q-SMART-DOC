import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { UserEntity } from '../../infrastructure/repositories/user.entity';
import { DocumentUseCase } from './document.usecase';
import { DocumentController } from './document.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document, UserEntity]), JwtServiceModule],
  controllers: [DocumentController],
  providers: [DocumentUseCase],
})
export class DocumentModule {}
