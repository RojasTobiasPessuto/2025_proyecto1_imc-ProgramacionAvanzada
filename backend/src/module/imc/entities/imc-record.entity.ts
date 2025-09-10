import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'imc_records' })
export class ImcRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { precision: 5, scale: 2 })
  pesoKg: number;

  @Column('numeric', { precision: 3, scale: 2 })
  alturaM: number;

  @Column('numeric', { precision: 5, scale: 2 })
  imc: number;

  @Column({ type: 'varchar', length: 20 })
  categoria: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true }) 
  user_id: number;
}
