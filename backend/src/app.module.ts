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
  host: process.env.DB_HOST, // aws-1-us-east-2.pooler.supabase.com
  port: parseInt(process.env.DB_PORT || '6543', 10),
  username: process.env.DB_USER, // postgres.xxxxx (el largo del dashboard)
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, // postgres
  autoLoadEntities: true,
  synchronize: false, // ⚠️ muy importante: el pooler no soporta esto
  ssl: {
    rejectUnauthorized: false,
  },
}),


  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
