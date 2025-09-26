import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from './module/imc/imc.module';
import { User } from './module/imc/entities/user.entity';
import { ImcRecord } from './module/imc/entities/imc-record.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { EstadisticasModule } from './module/estadisticas/estadisticas.module';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ping() {
    return { ok: true, ts: Date.now() };
  }
}

@Module({
  imports: [
    // app.module.ts
TypeOrmModule.forRoot({
  type: 'mongodb',
  // Usa PUBLIC_URL si está presente (requiere TLS); sino, intenta interno
  url: process.env.MONGO_PUBLIC_URL
    ? `${process.env.MONGO_PUBLIC_URL}?authSource=admin`
    : undefined,
  host: process.env.MONGO_PUBLIC_URL ? undefined : process.env.MONGOHOST,
  port: process.env.MONGO_PUBLIC_URL ? undefined : parseInt(process.env.MONGOPORT || '27017', 10),
  username: process.env.MONGOUSER,
  password: process.env.MONGOPASSWORD,
  database: process.env.MONGODATABASE || 'railway',
  authSource: 'admin',
  ssl: !!process.env.MONGO_PUBLIC_URL, // TLS solo si usamos la URL pública
  entities: [User, ImcRecord],
  synchronize: true,                 // desactiva en prod
  retryAttempts: 10,                 // <-- reintentos para evitar crash en arranque
  retryDelay: 3000,
}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
