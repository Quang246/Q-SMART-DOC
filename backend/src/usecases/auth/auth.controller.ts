import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
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
    const result = await this.authUseCase.login(
      loginDto.username,
      loginDto.password,
    );
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }
}
