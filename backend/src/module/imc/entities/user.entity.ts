import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ImcRecord } from '../../imc/entities/imc-record.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamptz' })
  createdAt: Date;


  @OneToMany(() => ImcRecord, (imcRecord) => imcRecord.user)
  imcRecords: ImcRecord[];
}
