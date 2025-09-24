//imc.repository.ts
//cajita de consultas a la base
import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ImcRecord } from './entities/imc-record.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ImcRepository extends Repository<ImcRecord> {
  constructor(private dataSource: DataSource) { // representa la conexión a la BD
    super(ImcRecord, dataSource.createEntityManager());
  }


  //Es un helper para guardar un nuevo cálculo de IMC en la base.
  //Recibe un objeto parcial (peso, altura, user_id, etc.), y usa el save heredado de Repository.
  //Devuelve el registro guardado (con id, createdAt, etc.).
  async saveRecord(record: Partial<ImcRecord>): Promise<ImcRecord> {
    return this.save(record);
  }

  async findByUserAndDates(
    user_id: ObjectId,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<ImcRecord[]> {
    const where: any = { user_id };
  
    if (fechaInicio && fechaFin) {
      where.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin + 'T23:59:59'),
      };
    } else if (fechaInicio) {
      where.createdAt = { $gte: new Date(fechaInicio) };
    } else if (fechaFin) {
      where.createdAt = { $lte: new Date(fechaFin + 'T23:59:59') };
    }
  
    return this.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }  
}
