import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthUseCase } from './auth.usecase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() dto: RegisterDto) {
    return this.authUseCase.register(dto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authUseCase.login(
        loginDto.username,
        loginDto.password,
      );

      return {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        data: result,
      };
    } catch (error) {
      // Nếu đã là HttpException thì ném lại
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Thông tin đăng nhập chưa chính xác');
      }

      // Nếu lỗi từ Validation hoặc do dữ liệu
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Dữ liệu đầu vào không hợp lệ');
      }

      // Còn lại: lỗi không xác định
      throw new InternalServerErrorException('Lỗi hệ thống khi đăng nhập');
    }
  }
}
