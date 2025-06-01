/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { UserM } from '../../domain/model/user';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';

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

  async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepo.update(userId, { hash_refresh_token: refreshToken });
  }
  async getAllUsers(): Promise<UserM[]> {
    const users = await this.userRepo.find();
    return users as unknown as UserM[];
  }
  async getUserById(userId: number): Promise<UserM | null> {
    const user = await this.userRepo.findOne({ where: { userId } });
    return user ? (user as unknown as UserM) : null;
  }
  async updateUser(userId: number, data: Partial<UserM>): Promise<UserM> {
    await this.userRepo.update(userId, data as any);
    const updatedUser = await this.userRepo.findOne({ where: { userId } });
    return updatedUser as unknown as UserM;
  }
  async getUsersByIds(ids: number[]): Promise<UserM[]> {
    const userEntities = await this.userRepo.find({ where: { userId: In(ids) } });
    return plainToInstance(UserM, userEntities, {
      excludeExtraneousValues: true,
    });
  }
  async deleteUsers(users: UserM[]): Promise<void> {
    const userIds = users.map(u => u.userId);
    await this.userRepo.delete({ userId: In(userIds) });
  }

  async deleteUsersByIds(ids: number[]): Promise<void> {
    await this.userRepo.delete({ userId: In(ids) });
  }
}
