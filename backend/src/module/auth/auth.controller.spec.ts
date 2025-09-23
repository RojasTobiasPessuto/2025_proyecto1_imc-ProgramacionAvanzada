<<<<<<< HEAD

=======
>>>>>>> origenISW/tobias-Programacion
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
<<<<<<< HEAD
    it('debería lanzar una excepción BadRequestException si falta el correo electrónico o la contraseña.', async () => {
=======
    it('should throw BadRequestException if email or password is missing', async () => {
>>>>>>> origenISW/tobias-Programacion
      await expect(controller.register({ email: '', password: '' }))
        .rejects.toThrow(BadRequestException);
    });

<<<<<<< HEAD
    it('Debe llamar a AuthService.register con datos válidos.', async () => {
=======
    it('should call AuthService.register with valid data', async () => {
>>>>>>> origenISW/tobias-Programacion
      mockAuthService.register.mockResolvedValue({ id: 1, email: 'test@mail.com' });

      const result = await controller.register({
        email: 'test@mail.com',
        password: '1234',
      });

      expect(result).toEqual({ id: 1, email: 'test@mail.com' });
      expect(service.register).toHaveBeenCalledWith('test@mail.com', '1234');
    });
  });

  describe('login', () => {
<<<<<<< HEAD
    it('debería lanzar una excepción BadRequestException si falta el correo electrónico o la contraseña.', async () => {
=======
    it('should throw BadRequestException if email or password is missing', async () => {
>>>>>>> origenISW/tobias-Programacion
      await expect(controller.login({ email: '', password: '' }))
        .rejects.toThrow(BadRequestException);
    });

<<<<<<< HEAD
    it('Debe llamar a AuthService.login con datos válidos.', async () => {
=======
    it('should call AuthService.login with valid data', async () => {
>>>>>>> origenISW/tobias-Programacion
      mockAuthService.login.mockResolvedValue({ token: 'jwt-token' });

      const result = await controller.login({
        email: 'test@mail.com',
        password: '1234',
      });

      expect(result).toEqual({ token: 'jwt-token' });
      expect(service.login).toHaveBeenCalledWith('test@mail.com', '1234');
    });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> origenISW/tobias-Programacion
