//estadisticas.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly service: EstadisticasService) {}

  private parseUser(user_id: string) {
    const n = Number(user_id);
    if (!user_id || isNaN(n)) {
      throw new BadRequestException('user_id inválido');
    }
    return n;
  }

  @Get('promedio')
  promedio(@Query('user_id') user_id: string) {
    return this.service.promedio(this.parseUser(user_id));
  }

  @Get('evolucion')
  evolucion(@Query('user_id') user_id: string) {
    return this.service.evolucion(this.parseUser(user_id));
  }

  @Get('distribucion')
  distribucion(@Query('user_id') user_id: string) {
    return this.service.distribucion(this.parseUser(user_id));
  }

  @Get('variacion')
  variacion(@Query('user_id') user_id: string) {
    return this.service.variacion(this.parseUser(user_id));
  }
}
