import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";

@Controller("imc")
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post("calcular")
  async calcular(@Body() dto: CalcularImcDto) {
    return this.imcService.calcularYGuardar(dto);
  }

  @Get("historial")
  async historial(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    return this.imcService.listarHistorial(fechaInicio, fechaFin);
  }
}
