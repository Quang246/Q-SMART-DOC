import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategory {
  @ApiProperty()
  @IsString()
  categoryName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parentId?: number;
}
export class EditCategory {
  @ApiProperty()
  categoryName?: string;
  @ApiProperty()
  parentId?: number;
}
export class CategoryResponseDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  categoryName: string;
  @ApiProperty()
  parentId: number;
}
