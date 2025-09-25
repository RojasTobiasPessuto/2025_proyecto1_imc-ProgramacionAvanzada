import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ObjectId } from 'mongodb';

@Controller('imc')
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
    if (!user_id || !ObjectId.isValid(user_id)) {
      throw new BadRequestException('user_id es requerido y debe ser un ObjectId válido');
    }
    return this.imcService.listarHistorial(user_id, fechaInicio, fechaFin);
  }
}
