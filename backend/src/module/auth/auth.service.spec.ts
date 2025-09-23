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
<<<<<<< HEAD
    it('debería lanzar si el correo electrónico ya existe', async () => {
=======
    it('should throw if email already exists', async () => {
>>>>>>> origenISW/tobias-Programacion
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com' });
      await expect(service.register('test@mail.com', '1234'))
        .rejects.toThrow(UnauthorizedException);
    });

<<<<<<< HEAD
    it('Debe cifrar la contraseña y guardar el usuario.', async () => {
=======
    it('should hash password and save user', async () => {
>>>>>>> origenISW/tobias-Programacion
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
<<<<<<< HEAD
    it('debería lanzar si no se encuentra el usuario', async () => {
=======
    it('should throw if user not found', async () => {
>>>>>>> origenISW/tobias-Programacion
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login('no@mail.com', '1234'))
        .rejects.toThrow(UnauthorizedException);
    });

<<<<<<< HEAD
    it('debería lanzar si la contraseña no es válida', async () => {
=======
    it('should throw if password invalid', async () => {
>>>>>>> origenISW/tobias-Programacion
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('test@mail.com', 'wrong'))
        .rejects.toThrow(UnauthorizedException);
    });

<<<<<<< HEAD
    it('debe devolver los datos del usuario si el inicio de sesión se ha realizado correctamente', async () => {
=======
    it('should return user data if login successful', async () => {
>>>>>>> origenISW/tobias-Programacion
      userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@mail.com', '1234');
      expect(result).toEqual({ id: 1, email: 'test@mail.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashed');
    });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> origenISW/tobias-Programacion
