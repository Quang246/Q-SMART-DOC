import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document' })
  @IsNotEmpty({ message: 'Tên tài liệu không được để trống' })
  title: string;

  @ApiProperty({ description: 'Author of the document', required: true })
  @IsNotEmpty({ message: 'Tên tác giả không được để trống' })
  author: string;

  @ApiProperty({ description: 'Category ID', required: true, example: 5 })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Category không được để trống' })
  @IsNumber({}, { message: 'Category ID phải là số' })
  categoryId: number;

  @ApiProperty({
    description: 'File path of the document',
    example: 'uploads/file.docx',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập đường dẫn file' })
  filePath: string;

  @ApiProperty({ description: 'ID of user who created', required: false })
  createdBy?: number;
}
export class UpdateDocumentDto {
  @ApiProperty({ description: 'Title of the document', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Author of the document', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'File path of the document', required: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập đường dẫn file' })
  filePath: string;
  @ApiProperty({ description: 'ID of user who created', required: false })
  updatedBy?: number;
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
  createdBy: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'UserName' })
  createdByUser: string;

  @ApiProperty({ description: 'ID of the user who updated', required: false })
  updatedBy: number;

  @ApiProperty({ description: 'Updation date' })
  updatedAt: Date;

  @ApiProperty({ description: 'UserName' })
  updatedByUser: string;
}
