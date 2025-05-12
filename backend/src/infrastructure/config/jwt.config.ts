import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET!,
  signOptions: {
    expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME || '1800', 10),
  },
};

export const jwtRefreshTokenConfig: JwtModuleOptions = {
  secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  signOptions: {
    expiresIn: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '86400',
      10,
    ),
  },
};
