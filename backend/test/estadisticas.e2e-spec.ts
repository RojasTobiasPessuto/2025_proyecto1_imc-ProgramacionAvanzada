import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EstadisticasModule } from '../src/module/estadisticas/estadisticas.module';
import { ImcRecord } from '../src/module/imc/entities/imc-record.entity';
import { Repository } from 'typeorm';

describe('Estadisticas (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<ImcRecord>;
  const testUserId = 1;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ImcRecord],
          synchronize: true,
        }),
        EstadisticasModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repo = moduleFixture.get<Repository<ImcRecord>>(getRepositoryToken(ImcRecord));
    await app.init();

    // Insertar dataset
    for (let i = 0; i < 100; i++) {
      await repo.save({
        pesoKg: 70 + (i % 5),
        alturaM: 1.75,
        imc: (70 + (i % 5)) / (1.75 * 1.75),
        categoria: i % 2 === 0 ? 'Normal' : 'Sobrepeso',
        user_id: testUserId,
        createdAt: new Date(2025, 0, 1 + i),
      });
    }
  });

  it('GET /estadisticas/promedio', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/promedio?user_id=1')
      .expect(200);
    expect(res.body).toHaveProperty('promedio');
  });

  it('GET /estadisticas/evolucion', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/evolucion?user_id=1')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /estadisticas/distribucion', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/distribucion?user_id=1')
      .expect(200);
    expect(res.body).toHaveProperty('Normal');
  });

  it('GET /estadisticas/variacion', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/variacion?user_id=1')
      .expect(200);
    expect(res.body).toHaveProperty('variacion_imc');
  });

  afterAll(async () => {
    await app.close();
  });
});
