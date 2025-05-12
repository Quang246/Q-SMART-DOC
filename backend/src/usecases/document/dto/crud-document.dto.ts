import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  docname: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty()
  file_path: string;

  @ApiProperty({ required: false })
  created_by?: number;
}

export class UpdateDocumentDto {
  @ApiProperty({ required: false })
  docname?: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  file_path?: string;
}

export class DocumentResponseDto {
  @ApiProperty()
  docid: number;

  @ApiProperty()
  docname: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty()
  file_path: string;

  @ApiProperty({ required: false })
  created_by?: number;

  @ApiProperty()
  created_at: Date;
}
