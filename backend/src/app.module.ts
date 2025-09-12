import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from './module/imc/imc.module';
import { User } from './module/imc/entities/user.entity';
import { ImcRecord } from './module/imc/entities/imc-record.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 esto carga el .env automáticamente
    ImcModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, ImcRecord],
      synchronize: true,
      ssl: { rejectUnauthorized: false },   // 🔑 requerido por Supabase
  extra: {
    ssl: true,
    statement_timeout: 5000,
    query_timeout: 5000
  }
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
