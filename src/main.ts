import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import * as express from 'express';
import { join } from 'path';
//testpush
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  app.use('/assets', express.static(join(__dirname, '..', 'src/assets')));
  await app.listen(3000);
}
bootstrap();
