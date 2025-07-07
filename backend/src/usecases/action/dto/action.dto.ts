import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateActionDto {
  @ApiProperty({ description: 'Tên chức năng' })
  @IsNotEmpty({ message: 'Tên chức năng không được để trống' })
  actionName: string;

  @ApiProperty({ description: 'Mô tả chức năng', required: true })
  @IsNotEmpty({ message: 'Mô tả chức năng không được để trống' })
  description: string;

  @ApiProperty({ description: 'Đường dẫn', required: true })
  @IsNotEmpty({ message: 'Đường dẫn không được để trống' })
  router: string;
  @ApiProperty({ description: 'ID of user who created', required: false })
  createdBy?: number;
}
export class UpdateActionDto {
  @ApiProperty({ description: 'Tên chức năng' })
  @IsNotEmpty({ message: 'Tên chức năng không được để trống' })
  actionName: string;

  @ApiProperty({ description: 'Mô tả chức năng', required: true })
  @IsNotEmpty({ message: 'Mô tả chức năng không được để trống' })
  description: string;

  @ApiProperty({ description: 'Đường dẫn', required: true })
  @IsNotEmpty({ message: 'Đường dẫn không được để trống' })
  router: string;
  @ApiProperty({ description: 'ID of user who created', required: false })
  updatedBy?: number;
}

export class ActionResponseDto {
  @ApiProperty({ description: 'Action ID' })
  actionId: number;

  @ApiProperty({ description: 'Name of the action' })
  actionName: string;

  @ApiProperty({ description: 'Decription of the action' })
  decription: string;

  @ApiProperty({ description: 'ID of the user who created' })
  createdBy: number;

  @ApiProperty({ description: 'Creation date' })
  createdDate: Date;

  @ApiProperty({ description: 'UserName' })
  createdByUser: string;

  @ApiProperty({ description: 'ID of the user who updated', required: false })
  updatedBy: number;

  @ApiProperty({ description: 'Updation date' })
  updatedDate: Date;

  @ApiProperty({ description: 'UserName' })
  updatedByUser: string;
}
