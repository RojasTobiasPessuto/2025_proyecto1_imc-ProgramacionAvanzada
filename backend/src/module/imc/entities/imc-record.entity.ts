import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from './user.entity';



@Entity({ name: 'imc_records' })
export class ImcRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { name: 'pesokg', precision: 5, scale: 2 })
  pesoKg: number;

  @Column('numeric', { name: 'alturam', precision: 3, scale: 2 })
  alturaM: number;

  @Column('numeric', { name: 'imc', precision: 5, scale: 2 })
  imc: number;

  @Column({ type: 'varchar', length: 20 })
  categoria: string;

  @CreateDateColumn({ name: 'createdat' , type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, user => user.imcRecords, { nullable: true, onDelete: 'SET NULL' })
  user: User;
}
