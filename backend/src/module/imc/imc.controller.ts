import { Controller, Post, Get, Body } from "@nestjs/common";
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
  async historial() {
    return this.imcService.listarHistorial();
  }
}
