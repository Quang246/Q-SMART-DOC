import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import { StatisticUseCase } from './statistic.usecase';
import { StatisticController } from './statistic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentStatistic])],
  controllers: [StatisticController],
  providers: [StatisticUseCase],
})
export class StatisticModule {}
