/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { UserM } from '../../domain/model/user';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getUserByUsername(username: string): Promise<UserM | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    return user ? (user as unknown as UserM) : null;
  }

  async createUser(user: Partial<UserM>): Promise<UserM> {
    const newUser = this.userRepo.create(user as any);
    const saved = await this.userRepo.save(newUser);
    return saved as unknown as UserM;
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepo.update(userId, { hash_refresh_token: refreshToken });
  }
}
