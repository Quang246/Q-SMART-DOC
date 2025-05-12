import { UserM } from '../model/user';

export interface IUserRepository {
  [x: string]: any;
  getUserByUsername(username: string): Promise<UserM | null>;
  createUser(user: Partial<UserM>): Promise<UserM>;
  updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void>;
}
