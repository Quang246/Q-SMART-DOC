import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiSuggestUseCase } from './ai-search.usecase';
import { AiSuggestController } from './ai-search.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AiSuggestController],
  providers: [AiSuggestUseCase],
})
export class AiSuggestModule {}
