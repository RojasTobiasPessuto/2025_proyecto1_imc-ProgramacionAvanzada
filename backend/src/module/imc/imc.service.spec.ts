//imc.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { getRepositoryToken } from "@nestjs/typeorm";
import { ImcRecord } from "../imc/entities/imc-record.entity";
import { Repository } from "typeorm";

describe("ImcService", () => {
  let service: ImcService;
  let repo: Repository<ImcRecord>;

  const mockRepo = {
    create: jest.fn().mockImplementation((data) => data),
    save: jest.fn().mockImplementation((data) =>
      Promise.resolve({
        ...data,
        id: "uuid-1234",
        createdAt: new Date("2025-01-01T00:00:00Z"),
      }),
    ),
    find: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        {
          provide: getRepositoryToken(ImcRecord),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
    repo = module.get<Repository<ImcRecord>>(getRepositoryToken(ImcRecord));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // Casos de cálculo de IMC
  it("should calculate IMC correctly (Normal)", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70, user_id: 1 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(22.86, 2);
    expect(result.categoria).toBe("Normal");
    expect(repo.save).toHaveBeenCalled();
  });

  it("should return Bajo peso for IMC < 18.5", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50, user_id: 2 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe("Bajo peso");
  });

  it("should return Sobrepeso for 25 <= IMC < 30", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80, user_id: 3 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe("Sobrepeso");
  });

  it("should return Obesidad for IMC >= 30", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100, user_id: 4 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe("Obesidad");
  });

  describe('listarHistorial', () => {
    beforeEach(() => {
      mockRepo.find.mockClear();
    });

    it('should filter by date range when both fechaInicio and fechaFin are provided', async () => {
      const mockRecords = [{ id: '1', user_id: 1 }];
      mockRepo.find.mockResolvedValue(mockRecords);

      await service.listarHistorial(1, '2024-01-01', '2024-01-31');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          createdAt: expect.any(Object), // Between object
        },
        order: { createdAt: 'DESC' },
      });
    });

    it('should filter by start date only when only fechaInicio is provided', async () => {
      const mockRecords = [{ id: '1', user_id: 1 }];
      mockRepo.find.mockResolvedValue(mockRecords);

      await service.listarHistorial(1, '2024-01-01');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          createdAt: expect.any(Object), // MoreThanOrEqual object
        },
        order: { createdAt: 'DESC' },
      });
    });

    it('should filter by end date only when only fechaFin is provided', async () => {
      const mockRecords = [{ id: '1', user_id: 1 }];
      mockRepo.find.mockResolvedValue(mockRecords);

      await service.listarHistorial(1, undefined, '2024-01-31');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          createdAt: expect.any(Object), // LessThanOrEqual object
        },
        order: { createdAt: 'DESC' },
      });
    });

    it('should not filter by date when no dates are provided', async () => {
      const mockRecords = [{ id: '1', user_id: 1 }];
      mockRepo.find.mockResolvedValue(mockRecords);

      await service.listarHistorial(1);

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { user_id: 1 },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no records found', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.listarHistorial(999);

      expect(result).toEqual([]);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { user_id: 999 },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
