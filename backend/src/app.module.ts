/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      connectionFactory: (connection: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log('MongoDB connected:', connection?.name ?? 'Unknown');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return connection as typeof connection; // Ép kiểu an toàn
      },
    }),
  ],
})
export class AppModule {}
