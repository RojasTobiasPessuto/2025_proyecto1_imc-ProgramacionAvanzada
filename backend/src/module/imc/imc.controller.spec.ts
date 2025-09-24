//imc.controller.spec.ts
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
    it('debería llamar a calcularYGuardar con dto', async () => {
      const dto = { user_id: 1, peso: 70, altura: 1.75 };
      mockImcService.calcularYGuardar.mockResolvedValue('Normal');
      const result = await controller.calcular(dto);
      expect(result).toBe('Normal');
      expect(service.calcularYGuardar).toHaveBeenCalledWith(dto);
    });
  });

  describe('historial', () => {
    it('debería lanzar una excepción BadRequestException si user_id no es válido.', async () => {
      await expect(
        controller.historial('abc', '2025-01-01', '2025-02-01'),
      ).rejects.toThrow(BadRequestException);
    });

    it('Debe llamar a listarHistorial con un user_id válido.', async () => {
      const mockHistorial = [{ id: 1, imc: 22 }];
      mockImcService.listarHistorial.mockResolvedValue(mockHistorial);

      const result = await controller.historial('1', '2025-01-01', '2025-02-01');

      expect(result).toEqual(mockHistorial);
      expect(service.listarHistorial).toHaveBeenCalledWith(1, '2025-01-01', '2025-02-01');
    });
  });
});
