// src/module/imc/dto/calcular-imc-dto.ts
import { IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CalcularImcDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.3)
  altura: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  peso: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id: number;
}
