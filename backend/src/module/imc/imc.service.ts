import { Injectable } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ImcRecord } from "./entities/imc-record.entity";

@Injectable()
export class ImcService {
  constructor(
    @InjectRepository(ImcRecord)
    private readonly repo: Repository<ImcRecord>,
  ) {}

  private categorizar(imc: number): string {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 25) return "Normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidad";
  }

  async calcularYGuardar(
    data: CalcularImcDto,
  ): Promise<{ id: string; imc: number; categoria: string; createdAt: Date }> {
    const { altura, peso, user_id } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    const categoria = this.categorizar(imcRedondeado);

    const record = this.repo.create({
      pesoKg: peso,
      alturaM: altura,
      imc: imcRedondeado,
      categoria,
      user_id,
    });

    const saved = await this.repo.save(record);

    return {
      id: saved.id,
      imc: saved.imc,
      categoria: saved.categoria,
      createdAt: saved.createdAt,
    };
  }

  async listarHistorial(
  user_id: number,
  fechaInicio?: string,
  fechaFin?: string
): Promise<ImcRecord[]> {
  const where: any = { user_id };

  if (fechaInicio && fechaFin) {
    where.createdAt = Between(new Date(fechaInicio), new Date(fechaFin + 'T23:59:59'));
  } else if (fechaInicio) {
    where.createdAt = MoreThanOrEqual(new Date(fechaInicio));
  } else if (fechaFin) {
    where.createdAt = LessThanOrEqual(new Date(fechaFin + 'T23:59:59'));
  }

  return this.repo.find({
    where,
    order: { createdAt: "DESC" }, // 👈 aquí también sigue siendo createdAt
  });
  }
}
