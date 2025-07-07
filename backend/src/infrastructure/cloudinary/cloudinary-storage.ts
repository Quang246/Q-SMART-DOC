import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import * as path from 'path';
export const createCloudinaryMulterOptions = (
  configService: ConfigService,
): MulterOptions => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });

  return {
    storage: new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const publicId =
          slugify(base, { lower: true, strict: true }) + '-' + Date.now() + ext;
        const isPDF = file.mimetype === 'application/pdf';

        return {
          folder: 'QSmartDoc',
          public_id: publicId,
          resource_type: isPDF ? 'raw' : 'auto',
          access_mode: 'public',
        };
      },
    }),
  };
};
