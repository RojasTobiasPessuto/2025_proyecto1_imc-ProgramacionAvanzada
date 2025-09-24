import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('imc_records')
export class ImcRecord {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  pesoKg: number;

  @Column()
  alturaM: number;

  @Column()
  imc: number;

  @Column()
  categoria: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  user_id: ObjectId; // referencia al usuario
}
