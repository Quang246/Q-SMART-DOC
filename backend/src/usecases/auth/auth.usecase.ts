/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { IJwtService } from 'src/domain/adapters/jwt.interface';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUseCase {
  userRepository: any;
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IJwtService') private readonly jwtService: IJwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.getUserByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.roleId,
      message: 'Đăng ký thành công',
    };
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ userid: number; username: string; access_token: string }> {
    const user = await this.userRepo.getUserByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, userid: user.userId };

    const token = await this.jwtService.sign(payload);
    return {
      userid: user.userId,
      username: user.username,
      access_token: token,
    };
  }
  async getAllUsers() {
    const users = await this.userRepo.getAllUsers();
    return users;
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const updatedUser = await this.userRepo.updateUser(userId, {
      username: dto.username,
      email: dto.email,
      roleId: dto.roleId,
      updatedDate: new Date(),
    });

    return {
      user: updatedUser,
    };
  }
  async deleteUsers(ids: number[]) {
    const users = await this.userRepo.getUsersByIds(ids);
    if (users.length === 0) {
      throw new NotFoundException('Không tìm thấy user nào để xóa');
    }
    await this.userRepo.deleteUsersByIds(ids);
    return {
      statusCode: HttpStatus.OK,
      message: `Đã xóa ${users.length} user`,
    };
  }
}
