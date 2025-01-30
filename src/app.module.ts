import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

//Import Entités
import { User } from './users/users.entity';
import { Image } from './image/entities/image.entity';
import { Certificate } from './certificate/entities/certificate.entity';

//Import Modules
import { UsersModule } from './users/users.module';
import { ImageModule } from './image/image.module';
import { CertificateModule } from './certificate/certificate.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Image, Certificate],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ImageModule,
    CertificateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
