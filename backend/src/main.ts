import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import authRoutes from '../routes/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para el frontend
  app.enableCors();

  // Pipes globales de validación
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Agrega tus rutas personalizadas de Express
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(require('express').json());
  expressApp.use('/api', authRoutes);

  await app.listen(3000);
}
bootstrap();