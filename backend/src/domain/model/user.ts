export class UserWithoutPassword {
  userId: number;
  username: string;
  email: string;
  role: string;
  createDate: Date;
  updatedDate: Date;
  hashRefreshToken: string;
}

export class UserM extends UserWithoutPassword {
  // [x: string]: any;
  password: string;
}
