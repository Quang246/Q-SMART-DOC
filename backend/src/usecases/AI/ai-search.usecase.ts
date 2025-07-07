/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AiSuggestUseCase {
  private readonly logger = new Logger(AiSuggestUseCase.name);

  async execute(query: string): Promise<string[]> {
    console.log('TOKEN:', process.env.OPENROUTER_API_KEY);
    const payload = {
      model: 'openai/gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'user',
          content: `Hãy gợi ý 5 tên tiêu đề file trong quản lý thư viện số về các môn học hay nghị định bắt đầu bằng: "${query}"`,
        },
      ],
    };

    let retries = 2;
    let response: any;
    let text = '';

    // Gọi API với retry tối đa 2 lần nếu lỗi
    while (retries-- >= 0) {
      try {
        response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );

        text = await response.text(); // đọc dưới dạng text để dễ debug
        break; // nếu thành công, thoát vòng lặp
      } catch (error) {
        this.logger.warn(
          `Gọi OpenRouter thất bại, thử lại lần ${2 - retries}/2: ${error}`,
        );
        await new Promise((res) => setTimeout(res, 1000)); // đợi 1s rồi thử lại
      }
    }

    if (!response || !text) {
      this.logger.error('Không thể kết nối tới OpenRouter sau khi thử lại.');
      return [];
    }

    // Check HTTP status
    if (!response.ok) {
      this.logger.error(`OpenRouter trả về lỗi ${response.status}: ${text}`);
      return [];
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (err) {
      this.logger.error('Phản hồi không phải JSON hợp lệ:', text);
      return [];
    }

    const content = data.choices?.[0]?.message?.content;

    return content
      ? content
          .split('\n')
          .map((line) => line.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
      : [];
  }
}
