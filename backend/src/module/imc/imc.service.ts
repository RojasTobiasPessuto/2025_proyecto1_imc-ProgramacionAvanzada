import { Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcRepository } from './imc.repository';
import { ImcRecord } from './entities/imc-record.entity';

@Injectable()
export class ImcService {
  constructor(private readonly repo: ImcRepository) {}

  private categorizar(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  async calcularYGuardar(
    data: CalcularImcDto,
  ): Promise<{ id: string; imc: number; categoria: string; createdat: Date }> {
    const { altura, peso, user_id } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    const categoria = this.categorizar(imcRedondeado);

    const saved = await this.repo.saveRecord({
      pesoKg: peso,
      alturaM: altura,
      imc: imcRedondeado,
      categoria,
      user_id,
    });

    return {
      id: saved.id,
      imc: saved.imc,
      categoria: saved.categoria,
      createdat: saved.createdAt,
    };
  }

  async listarHistorial(
    user_id: number,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<ImcRecord[]> {
    return this.repo.findByUserAndDates(user_id, fechaInicio, fechaFin);
  }
}
