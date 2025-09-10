import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularYGuardar: jest.fn(),
            listarHistorial: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return IMC and category for valid input', async () => {
  const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
  jest.spyOn(service, 'calcularYGuardar').mockResolvedValue({
    id: 'uuid-1234',
    imc: 22.86,
    categoria: 'Normal',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  });

  const result = await controller.calcular(dto);
  expect(result).toEqual({
    id: 'uuid-1234',
    imc: 22.86,
    categoria: 'Normal',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  });
  expect(service.calcularYGuardar).toHaveBeenCalledWith(dto);
});


  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };

    // Aplicar ValidationPipe manualmente en la prueba
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(
      validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }),
    ).rejects.toThrow(BadRequestException);

    // Verificar que el servicio no se llama porque la validación falla antes
    expect(service.calcularYGuardar).not.toHaveBeenCalled();
  });

  it('should return historial of IMC records', async () => {
  const mockHistorial = [
    {
      id: 'uuid-1',
      pesoKg: 70,
      alturaM: 1.75,
      imc: 22.86,
      categoria: 'Normal',
      createdAt: new Date('2025-01-01T00:00:00Z'),
    },
    {
      id: 'uuid-2',
      pesoKg: 80,
      alturaM: 1.75,
      imc: 26.12,
      categoria: 'Sobrepeso',
      createdAt: new Date('2025-01-02T00:00:00Z'),
    },
  ];

  jest.spyOn(service, 'listarHistorial').mockResolvedValue(mockHistorial);

  const result = await controller.historial();
  expect(result).toEqual(mockHistorial);
  expect(service.listarHistorial).toHaveBeenCalled();
});


});
