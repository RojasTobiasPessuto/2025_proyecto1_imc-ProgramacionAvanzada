import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from './module/imc/imc.module';
import { User } from './module/imc/entities/user.entity';
import { ImcRecord } from './module/imc/entities/imc-record.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { EstadisticasModule } from './module/estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...(process.env.DATABASE_URL || process.env.MYSQL_URL
        ? { url: process.env.DATABASE_URL || process.env.MYSQL_URL }
        : {
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
            username: process.env.DB_USER || process.env.MYSQLUSER,
            password: process.env.DB_PASS || process.env.MYSQLPASSWORD,
            database: process.env.DB_NAME || process.env.MYSQLDATABASE,
          }),
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
      entities: [User, ImcRecord],
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    ImcModule,
    EstadisticasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
