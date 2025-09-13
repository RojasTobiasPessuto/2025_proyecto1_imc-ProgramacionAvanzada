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
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // aws-1-us-east-2.pooler.supabase.com
      port: parseInt(process.env.DB_PORT || '6543', 10),
      username: process.env.DB_USER, // postgres.qdzlzkdbyebdckfhbxlq
      password: process.env.DB_PASS,
      database: process.env.DB_NAME, // postgres
      entities: [User, ImcRecord],
      autoLoadEntities: true,
      synchronize: false,   // ⚠️ nunca en pooler
      ssl: true,            // 👈 fuerza SSL
      extra: {
        max: 5,             // 👈 pocas conexiones porque el pooler limita
      },
    }),

    ImcModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
