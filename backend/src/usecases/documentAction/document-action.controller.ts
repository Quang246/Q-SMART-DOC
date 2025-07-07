import {
  Controller,
  UseGuards,
  Get,
  Param,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';
import { Request } from 'express';
import { DocumentUseCase } from './document-action.usecase';
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('documentAction')
export class DocumentController {
  constructor(private readonly useCase: DocumentUseCase) {}
  @Get('view/:id')
  async view(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { userId: number };
    const fileUrl = await this.useCase.viewPdf({
      id: +id,
      userId: user.userId,
      ipAddress: req.ip,
    });
    if (!fileUrl) {
      throw new NotFoundException(
        'Không phải định dạng PDF. Vui lòng tải xuống để xem!',
      );
    }
    return {
      message: 'Link tài liệu PDF',
      fileUrl: `${fileUrl}`,
    };
  }

  @Get('download/:id')
  async download(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as { userId: number };
    const result = await this.useCase.downloadFile({
      id,
      userId: user.userId,
      ipAddress: req.ip,
    });

    if (!result) throw new NotFoundException('Không thể tải tài liệu');

    // Trả về link + tên file
    return {
      url: result.url,
      fileName: result.fileName,
    };
  }
}
