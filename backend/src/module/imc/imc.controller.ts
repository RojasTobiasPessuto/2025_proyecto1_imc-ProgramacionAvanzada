import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';

@Controller('imc') // 👈 prefijo común
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post('calcular')
  async calcular(@Body() dto: CalcularImcDto) {
    return this.imcService.calcularYGuardar(dto);
  }

  @Get('historial')
  async historial(
    @Query('user_id') user_id: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    const userIdNum = Number(user_id);
    if (!user_id || isNaN(userIdNum)) {
      throw new BadRequestException('user_id es requerido y debe ser un número');
    }
    return this.imcService.listarHistorial(userIdNum, fechaInicio, fechaFin);
  }
}

