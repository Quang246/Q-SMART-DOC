import { Controller, Get, Query } from '@nestjs/common';
import { AiSuggestUseCase } from './ai-search.usecase';

@Controller('ai-suggest')
export class AiSuggestController {
  constructor(private readonly aiSuggestUseCase: AiSuggestUseCase) {}

  @Get()
  async suggest(@Query('q') query: string) {
    return this.aiSuggestUseCase.execute(query);
  }
}
