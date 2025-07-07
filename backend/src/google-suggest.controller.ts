/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('google-suggest')
export class GoogleSuggestController {
  @Get()
  async getSuggestions(@Query('q') query: string) {
    try {
      const response = await axios.get(
        'https://suggestqueries.google.com/complete/search',
        {
          params: { client: 'firefox', q: query },
        },
      );
      return response.data;
    } catch (error) {
      return { error: 'Không thể lấy gợi ý từ Google' };
    }
  }
}
