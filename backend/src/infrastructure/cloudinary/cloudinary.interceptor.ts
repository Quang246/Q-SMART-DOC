import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { createCloudinaryMulterOptions } from './cloudinary-storage';

@Injectable()
export class CloudinaryInterceptor implements NestInterceptor {
  private readonly delegate: NestInterceptor;

  constructor(private configService: ConfigService) {
    const options = createCloudinaryMulterOptions(this.configService);
    const InterceptorClass = FileInterceptor('file', options);
    this.delegate = new InterceptorClass();
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return this.delegate.intercept(context, next);
  }
}
