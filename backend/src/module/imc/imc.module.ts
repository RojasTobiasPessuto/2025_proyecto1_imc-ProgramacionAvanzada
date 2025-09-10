import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcRecord } from './entities/imc-record.entity';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImcRecord])],
  providers: [ImcService],
  controllers: [ImcController],
})
export class ImcModule {}
