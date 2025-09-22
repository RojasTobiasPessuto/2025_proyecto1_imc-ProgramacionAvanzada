import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { User } from './entities/user.entity';
import { ImcRecord } from './entities/imc-record.entity';
import { ImcRepository } from './imc.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, ImcRecord])],
  controllers: [ImcController],
  providers: [ImcService, ImcRepository],
  exports: [ImcService, ImcRepository],
})
export class ImcModule {}
