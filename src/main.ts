import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedBooks } from './seeds/book.seed';
import { DataSource } from 'typeorm';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
  const dataSource = app.get(DataSource);
  await seedBooks(dataSource);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
