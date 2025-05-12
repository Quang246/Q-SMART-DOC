import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceImpl } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: 'IJwtService',
      useClass: JwtServiceImpl,
    },
    JwtServiceImpl,
  ],
  exports: ['IJwtService', JwtModule],
})
export class JwtServiceModule {}
