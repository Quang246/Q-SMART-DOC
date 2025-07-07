import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/infrastructure/repositories/document.entity';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import { Repository } from 'typeorm';
import { extname } from 'path';
import {
  ViewDocumentDto,
  DownloadDocumentDto,
} from './dto/document-action.dto';

@Injectable()
export class DocumentUseCase {
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
    @InjectRepository(DocumentStatistic)
    private readonly statRepo: Repository<DocumentStatistic>,
  ) {}

  async findById(id: number): Promise<Document | null> {
    return this.docRepo.findOne({ where: { documentId: id } });
  }

  async logStatistic(
    userId: number,
    documentId: number,
    actionType: 'view' | 'download',
    ipAddress?: string,
  ) {
    const stat = this.statRepo.create({
      user_id: userId,
      document_id: documentId,
      action_type: actionType,
      ip_address: ipAddress,
    });
    await this.statRepo.save(stat);
  }

  async viewPdf(dto: ViewDocumentDto): Promise<string | null> {
    const doc = await this.findById(dto.id);
    const ext = extname(doc?.filePath || '').toLowerCase();
    if (!doc || ext !== '.pdf') return null;
    await this.logStatistic(dto.userId, doc.documentId, 'view', dto.ipAddress);
    return `${doc.filePath}`;
  }

  async downloadFile(dto: DownloadDocumentDto) {
    const doc = await this.findById(dto.id);
    if (!doc || !doc.filePath) {
      throw new NotFoundException('File không tồn tại trên server');
    }

    const ext = extname(doc.filePath.split('?')[0] || '').toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];
    if (!allowedExts.includes(ext)) {
      throw new BadRequestException('Định dạng file không được hỗ trợ');
    }

    await this.logStatistic(
      dto.userId,
      doc.documentId,
      'download',
      dto.ipAddress,
    );

    if (['.doc', '.docx'].includes(ext)) {
      await this.logStatistic(
        dto.userId,
        doc.documentId,
        'view',
        dto.ipAddress,
      );
    }

    // ✅ Trả về URL trực tiếp tới file
    return {
      url: doc.filePath,
      fileName: doc.title + ext, // nếu muốn trả kèm tên file gợi ý
    };
  }
}
