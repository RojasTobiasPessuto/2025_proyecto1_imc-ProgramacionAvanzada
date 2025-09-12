import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import authRouter from '../routes/auth'; // importa tu router de login/register
import * as express from 'express';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para el frontend
  app.enableCors();

  // Pipes globales de validación
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));


  app.use('/api', authRouter);

  // Render necesita PORT y 0.0.0.0
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
