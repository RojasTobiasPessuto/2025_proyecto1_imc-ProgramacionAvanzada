
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
    it('debería lanzar una excepción BadRequestException si falta el correo electrónico o la contraseña.', async () => {
      await expect(controller.register({ email: '', password: '' }))
        .rejects.toThrow(BadRequestException);
    });

    it('Debe llamar a AuthService.register con datos válidos.', async () => {
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
    it('debería lanzar una excepción BadRequestException si falta el correo electrónico o la contraseña.', async () => {
      await expect(controller.login({ email: '', password: '' }))
        .rejects.toThrow(BadRequestException);
    });

    it('Debe llamar a AuthService.login con datos válidos.', async () => {
      mockAuthService.login.mockResolvedValue({ token: 'jwt-token' });

      const result = await controller.login({
        email: 'test@mail.com',
        password: '1234',
      });

      expect(result).toEqual({ token: 'jwt-token' });
      expect(service.login).toHaveBeenCalledWith('test@mail.com', '1234');
    });
  });
});