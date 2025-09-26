// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // Configuración de CORS
  const allowedOrigins = [
    'https://2025-proyecto1-imc-programacion-ava-nu.vercel.app',
    'http://localhost:3000', // Para desarrollo local
  ];

  app.enableCors({
    origin: function (origin, callback) {
      // Permitir peticiones sin 'origin' (como apps móviles o curl)
      if (!origin) return callback(null, true);
      
      // Verificar si el origen está en la lista de permitidos
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'El CORS policy para este sitio no permite acceso desde el origen especificado.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));


  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Backend running on http://0.0.0.0:${port}`);
}
bootstrap();
