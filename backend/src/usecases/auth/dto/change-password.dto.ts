import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Mật khẩu cũ của người dùng',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword456',
    description: 'Mật khẩu mới của người dùng',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
