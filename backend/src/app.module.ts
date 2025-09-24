import { Module } from '@nestjs/common';
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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGOHOST,
      port: parseInt(process.env.MONGOPORT || '27017', 10),
      username: process.env.MONGOUSER,
      password: process.env.MONGOPASSWORD,
      database: process.env.MONGODATABASE,
      authSource: 'admin',
      ssl: false, // Railway suele manejar conexión interna, probá primero así
      entities: [User, ImcRecord],
      synchronize: true, // ⚠️ activar mientras probás, luego poner en false
    }),    
    AuthModule,
    ImcModule,
    EstadisticasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
