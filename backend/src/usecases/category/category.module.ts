import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/infrastructure/repositories/category.entity';
import { CategoryUseCase } from './category.usecase';
import { CategoryController } from './category.controller';
import { JwtServiceModule } from '../../infrastructure/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), JwtServiceModule],
  controllers: [CategoryController],
  providers: [CategoryUseCase],
})
export class CategoryModule {}
