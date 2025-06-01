import { Expose } from 'class-transformer';

export class UserWithoutPassword {
  userId: number;
  username: string;
  email: string;
  roleId: number;

  @Expose({ name: 'createdate' })
  createDate: Date;

  @Expose({ name: 'updatedDate' })
  updatedDate: Date;

  @Expose({ name: 'hash_refresh_token' })
  hashRefreshToken: string | null;
}

export class UserM extends UserWithoutPassword {
  password: string;
}
