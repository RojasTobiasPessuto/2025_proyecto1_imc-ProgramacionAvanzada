import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ImcRecord } from './entities/imc-record.entity';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';  // ✅ corregido

@Module({
  imports: [TypeOrmModule.forFeature([User, ImcRecord])],
  providers: [ImcService],
  controllers: [ImcController],
})
export class ImcModule {}
