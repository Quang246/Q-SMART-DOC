import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document' })
  title: string;

  @ApiProperty({ description: 'Author of the document', required: false })
  author?: string;

  @ApiProperty({ description: 'Category ID', required: false })
  categoryId?: number;

  @ApiProperty({ description: 'File path of the document' })
  filePath: string;

  @ApiProperty({ description: 'ID of user who created', required: false })
  createdBy?: number;
  @ApiProperty()
  createdAt: Date;
}

export class UpdateDocumentDto {
  @ApiProperty({ description: 'Title of the document', required: false })
  title?: string;

  @ApiProperty({ description: 'Author of the document', required: false })
  author?: string;

  @ApiProperty({ description: 'Category ID', required: false })
  categoryId?: number;

  @ApiProperty({ description: 'File path of the document', required: false })
  filePath?: string;
}

export class DocumentResponseDto {
  @ApiProperty({ description: 'Document ID' })
  documentId: number;

  @ApiProperty({ description: 'Title of the document' })
  title: string;

  @ApiProperty({ description: 'Author of the document', required: false })
  author?: string;

  @ApiProperty({ description: 'Category name', required: false })
  categoryName?: string;

  @ApiProperty({ description: 'File path of the document' })
  filePath: string;

  @ApiProperty({ description: 'ID of the user who created', required: false })
  createdBy?: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}
