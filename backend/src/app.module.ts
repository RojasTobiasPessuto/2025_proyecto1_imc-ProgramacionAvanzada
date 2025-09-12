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
    ConfigModule.forRoot({ isGlobal: true }), // carga .env automáticamente

    // conexión a Supabase
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // aws-1-us-east-2.pooler.supabase.com
      port: parseInt(process.env.DB_PORT || '6543', 10),
      username: process.env.DB_USER, // postgres.qdzlzkdbyebdckfhbxlq
      password: process.env.DB_PASS,
      database: process.env.DB_NAME, // postgres
      entities: [User, ImcRecord], // 👈 registrar explícitamente las entidades
      autoLoadEntities: true,       // y cargar entidades de los módulos
      synchronize: false,           // ⚠️ con pooler no usar true
      ssl: { rejectUnauthorized: false },
    }),

    ImcModule, // módulo de IMC
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
