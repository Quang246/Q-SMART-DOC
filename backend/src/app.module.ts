/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUseCase } from './usecases/auth/auth.usecase';
import { JwtServiceImpl } from './infrastructure/jwt/jwt.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserEntity } from './infrastructure/repositories/user.entity';
import { JwtServiceModule } from './infrastructure/jwt/jwt.module';
import { AuthController } from './usecases/auth/auth.controller';
import { DocumentModule } from './usecases/document/document.module';
import { CategoryModule } from './usecases/category/category.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: parseInt(config.get<string>('DATABASE_PORT', '3306')),
        username: config.get<string>('DATABASE_USER', 'root'),
        password: config.get<string>('DATABASE_PASSWORD', '123456'),
        database: config.get<string>('DATABASE_NAME', 'QSDOC'),
        synchronize: config.get<string>('DATABASE_SYNCHRONIZE', 'false') === 'true',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),

    // Đăng ký entity cho DI
    TypeOrmModule.forFeature([UserEntity]),

    // Các module khác
    JwtServiceModule,
    DocumentModule,
    CategoryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IJwtService',
      useClass: JwtServiceImpl,
    },
  ],
  exports: [AuthUseCase],
})
export class AppModule {}
