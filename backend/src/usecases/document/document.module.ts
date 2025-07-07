import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../infrastructure/repositories/document.entity';
import { UserEntity } from '../../infrastructure/repositories/user.entity';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import { DocumentUseCase } from './document.usecase';
import { DocumentController } from './document.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Document, UserEntity, DocumentStatistic]),
    JwtServiceModule,
    NestjsFormDataModule,
    ConfigModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentUseCase],
})
export class DocumentModule {}
