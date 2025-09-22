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

  it("debe calcular el IMC correctamente", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70, user_id: 1 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(22.86, 2);
    expect(result.categoria).toBe("Normal");
    expect(repo.save).toHaveBeenCalled();
  });

  it("debe devolver Bajo peso para IMC < 18,5", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50, user_id: 2 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe("Bajo peso");
  });

  it("debe devolver Sobrepeso para 25 <= IMC < 30", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80, user_id: 3 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe("Sobrepeso");
  });

  it("debe devolver Obesidad para IMC >= 30", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100, user_id: 4 };
    const result = await service.calcularYGuardar(dto);

    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe("Obesidad");
  });
});
