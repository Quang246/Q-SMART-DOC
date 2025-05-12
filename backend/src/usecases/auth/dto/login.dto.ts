import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the new user' })
  @IsString()
  username: string;
  @ApiProperty({
    example: 'StrongP@ss123',
    description: 'Password with min 6 chars',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
