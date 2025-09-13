import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../imc/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({ email, password: hash });
      await this.userRepo.save(user);
      return { id: user.id, email: user.email };
    } catch (err) {
      console.error('REGISTER ERROR:', err);
      throw new InternalServerErrorException('Error del servidor');
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { id: user.id, email: user.email };
  }
}
