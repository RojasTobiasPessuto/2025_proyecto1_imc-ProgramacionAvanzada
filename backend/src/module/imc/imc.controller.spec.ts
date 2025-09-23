<<<<<<< HEAD
=======
//imc.controller.spec.ts
>>>>>>> origenISW/tobias-Programacion
import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { BadRequestException } from '@nestjs/common';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  const mockImcService = {
    calcularYGuardar: jest.fn(),
    listarHistorial: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        { provide: ImcService, useValue: mockImcService },
      ],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calcular', () => {
<<<<<<< HEAD
    it('debería llamar a calcularYGuardar con dto', async () => {
=======
    it('should call calcularYGuardar with dto', async () => {
>>>>>>> origenISW/tobias-Programacion
      const dto = { user_id: 1, peso: 70, altura: 1.75 };
      mockImcService.calcularYGuardar.mockResolvedValue('Normal');
      const result = await controller.calcular(dto);
      expect(result).toBe('Normal');
      expect(service.calcularYGuardar).toHaveBeenCalledWith(dto);
    });
  });

  describe('historial', () => {
<<<<<<< HEAD
    it('debería lanzar una excepción BadRequestException si user_id no es válido.', async () => {
=======
    it('should throw BadRequestException if user_id is invalid', async () => {
>>>>>>> origenISW/tobias-Programacion
      await expect(
        controller.historial('abc', '2025-01-01', '2025-02-01'),
      ).rejects.toThrow(BadRequestException);
    });

<<<<<<< HEAD
    it('Debe llamar a listarHistorial con un user_id válido.', async () => {
=======
    it('should call listarHistorial with valid user_id', async () => {
>>>>>>> origenISW/tobias-Programacion
      const mockHistorial = [{ id: 1, imc: 22 }];
      mockImcService.listarHistorial.mockResolvedValue(mockHistorial);

      const result = await controller.historial('1', '2025-01-01', '2025-02-01');

      expect(result).toEqual(mockHistorial);
      expect(service.listarHistorial).toHaveBeenCalledWith(1, '2025-01-01', '2025-02-01');
    });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> origenISW/tobias-Programacion
