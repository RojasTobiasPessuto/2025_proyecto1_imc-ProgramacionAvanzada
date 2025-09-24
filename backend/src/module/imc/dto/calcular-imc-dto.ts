//calcualar-imc-dto.ts
// src/module/imc/dto/calcular-imc-dto.ts
import { IsNumber, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class CalcularImcDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.3)
  altura: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  peso: number;

  @IsString()
  user_id: string;// se valida que sea string, luego lo convertís a ObjectId en el service
}
