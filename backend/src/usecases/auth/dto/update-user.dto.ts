import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the new user' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;
}
