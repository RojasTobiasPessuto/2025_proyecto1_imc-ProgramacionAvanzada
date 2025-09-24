//user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ImcRecord } from './imc-record.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'createdat'})
  createdAt: Date;  // 👈 en minúsculas para matchear con la DB

  @OneToMany(() => ImcRecord, (imcRecord) => imcRecord.user)
  imcRecords: ImcRecord[];
}
