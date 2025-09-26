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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL // ej: mongodb://mongo:PASS@mongodb.railway.internal:27017/railway?authSource=admin
        ?? `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}/${process.env.MONGODATABASE}?authSource=admin`,
      ssl: false,                 // red interna == sin TLS
      entities: [User, ImcRecord],
      synchronize: true,          // desactívalo luego
      retryAttempts: 10,
      retryDelay: 3000,
      // opcional:
      extra: { directConnection: true, retryWrites: false },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
