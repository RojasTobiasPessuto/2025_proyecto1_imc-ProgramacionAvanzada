import { Injectable } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ImcRecord } from "./entities/imc-record.entity";

@Injectable()
export class ImcService {
  constructor(
    @InjectRepository(ImcRecord)
    private readonly repo: Repository<ImcRecord>, // Repositorio de TypeORM
  ) {}

  /**
   * Categorizar un valor de IMC en su rango correspondiente
   */
  private categorizar(imc: number): string {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 25) return "Normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidad";
  }

  /**
   * Calcula el IMC y guarda el resultado en la base de datos
   */
  async calcularYGuardar(
    data: CalcularImcDto,
  ): Promise<{ id: string; imc: number; categoria: string; createdAt: Date }> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    const categoria = this.categorizar(imcRedondeado);

    // Creamos la entidad y la guardamos en DB
    const record = this.repo.create({
      pesoKg: peso,
      alturaM: altura,
      imc: imcRedondeado,
      categoria,
    });

    const saved = await this.repo.save(record);

    return {
      id: saved.id,
      imc: saved.imc,
      categoria: saved.categoria,
      createdAt: saved.createdAt,
    };
  }

  /**
   * Devuelve todos los cálculos almacenados, con opción de filtrar por rango de fechas
   */
  async listarHistorial(fechaInicio?: string, fechaFin?: string): Promise<ImcRecord[]> {
    const where: any = {};
    if (fechaInicio && fechaFin) {
      where.createdAt = { $gte: fechaInicio, $lte: fechaFin };
    } else if (fechaInicio) {
      where.createdAt = { $gte: fechaInicio };
    } else if (fechaFin) {
      where.createdAt = { $lte: fechaFin };
    }
    // TypeORM usa Between, MoreThanOrEqual, LessThanOrEqual
    const query: any = {
      order: { createdAt: "DESC" },
    };
    if (fechaInicio && fechaFin) {
      query.where = { createdAt: Between(new Date(fechaInicio), new Date(fechaFin + 'T23:59:59')) };
    } else if (fechaInicio) {
      query.where = { createdAt: MoreThanOrEqual(new Date(fechaInicio)) };
    } else if (fechaFin) {
      query.where = { createdAt: LessThanOrEqual(new Date(fechaFin + 'T23:59:59')) };
    }
    return this.repo.find(query);
  }

}