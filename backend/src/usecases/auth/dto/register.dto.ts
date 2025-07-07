import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the new user' })
  @IsString()
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ss123',
    description: 'Password with min 8 chars',
  })
  @IsString()
  @MinLength(8, { message: 'Password phải có ít nhất 8 ký tự' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
}
