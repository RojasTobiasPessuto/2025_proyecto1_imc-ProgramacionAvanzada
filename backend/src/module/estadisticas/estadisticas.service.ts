//estadisticas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImcRecord } from '../imc/entities/imc-record.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(ImcRecord)
    private readonly repo: Repository<ImcRecord>,
  ) {}

  async promedio(user_id: number) {
    const records = await this.repo.find({ where: { user_id } });
    if (records.length === 0) return { promedio: 0 };
    const sum = records.reduce((a, r) => a + Number(r.imc), 0);
    return { promedio: sum / records.length };
  }

  async evolucion(user_id: number) {
    return this.repo.find({
      where: { user_id },
      order: { createdAt: 'ASC' },
    });
  }

  async distribucion(user_id: number) {
    const records = await this.repo.find({ where: { user_id } });
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      counts[r.categoria] = (counts[r.categoria] || 0) + 1;
    });
    return counts;
  }

  async variacion(user_id: number) {
    const records = await this.repo.find({ where: { user_id }, order: { createdAt: 'ASC' } });
    if (records.length < 2) return { variacion_imc: 0 };

    const primero = records[0].imc;
    const ultimo = records[records.length - 1].imc;

    return { variacion_imc: ultimo - primero };
  }
}
