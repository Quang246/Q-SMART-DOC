import { ApiProperty } from '@nestjs/swagger';
export class CreateCategory {
  @ApiProperty()
  categoryName: string;
  @ApiProperty()
  parentId: number;
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
