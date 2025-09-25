//estadisticas.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { ObjectId } from 'mongodb';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly service: EstadisticasService) {}

  private validateUserId(user_id: string): string {
    if (!user_id || !ObjectId.isValid(user_id)) {
      throw new BadRequestException('user_id inválido');
    }
    return user_id; // devolvemos string válido
  }

  @Get('promedio')
  promedio(@Query('user_id') user_id: string) {
    return this.service.promedio(this.validateUserId(user_id));
  }

  @Get('evolucion')
  evolucion(@Query('user_id') user_id: string) {
    return this.service.evolucion(this.validateUserId(user_id));
  }

  @Get('distribucion')
  distribucion(@Query('user_id') user_id: string) {
    return this.service.distribucion(this.validateUserId(user_id));
  }

  @Get('variacion')
  variacion(@Query('user_id') user_id: string) {
    return this.service.variacion(this.validateUserId(user_id));
  }
}