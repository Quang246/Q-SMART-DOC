import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  ParseIntPipe,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthUseCase } from './auth.usecase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUsersDto } from './dto/delete-user.dto';

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
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Thông tin đăng nhập chưa chính xác');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Dữ liệu đầu vào không hợp lệ');
      }
      throw new InternalServerErrorException('Lỗi hệ thống khi đăng nhập');
    }
  }

  @Get('getAllUser')
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  async getAllUsers() {
    const users = await this.authUseCase.getAllUsers();
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      data: instanceToPlain(users),
    };
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const result = await this.authUseCase.updateUser(id, dto);
    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      data: instanceToPlain(result),
    };
  }
  @Delete('DeleteUser')
  @ApiOperation({ summary: 'Xoá nhiều người dùng' })
  @ApiResponse({ status: 200, description: 'Xoá thành công' })
  deleteUsers(@Body() dto: DeleteUsersDto) {
    const { ids } = dto;
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('Thiếu hoặc sai định dạng ids');
    }
    return this.authUseCase.deleteUsers(ids);
  }
}
