/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import {
  JwtService as NestJwtService,
  JwtSignOptions,
  JwtVerifyOptions,
} from '@nestjs/jwt';
import { IJwtService } from '../../domain/adapters/jwt.interface';

@Injectable()
export class JwtServiceImpl implements IJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async sign(
    payload: Record<string, unknown>,
    options?: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  async verify<T extends object = any>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    return await this.jwtService.verifyAsync<T>(token, options);
  }

  async signRefreshToken(payload: Record<string, unknown>): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string,
    });
  }
}
