import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../imc/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// mock para bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: { findOne: jest.Mock; create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('debería lanzar si el correo electrónico ya existe', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com' });
      await expect(service.register('test@mail.com', '1234'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('Debe cifrar la contraseña y guardar el usuario.', async () => {
      userRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
      userRepo.create.mockReturnValue({ email: 'new@mail.com', password: 'hashed123' });
      userRepo.save.mockResolvedValue({ id: 1, email: 'new@mail.com' });

      const result = await service.register('new@mail.com', '1234');
      expect(result).toEqual({ id: 1, email: 'new@mail.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(userRepo.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería lanzar si no se encuentra el usuario', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login('no@mail.com', '1234'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar si la contraseña no es válida', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('test@mail.com', 'wrong'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('debe devolver los datos del usuario si el inicio de sesión se ha realizado correctamente', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@mail.com', '1234');
      expect(result).toEqual({ id: 1, email: 'test@mail.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashed');
    });
  });
});