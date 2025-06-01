import { UserM } from '../model/user';

export interface IUserRepository {
  [x: string]: any;
  getUserByUsername(username: string): Promise<UserM | null>;
  createUser(user: Partial<UserM>): Promise<UserM>;
  updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void>;
  getAllUsers(): Promise<UserM[]>;
  getUserById(userId: number): Promise<UserM | null>;
  updateUser(userId: number, data: Partial<UserM>): Promise<UserM>;
  getUsersByIds(ids: number[]): Promise<UserM[]>;
  deleteUsersByIds(ids: number[]): Promise<void>;
}
