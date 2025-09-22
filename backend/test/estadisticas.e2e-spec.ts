import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EstadisticasModule } from '../src/module/estadisticas/estadisticas.module';
import { ImcRecord } from '../src/module/imc/entities/imc-record.entity';
import { Repository } from 'typeorm';

require('dotenv').config();
jest.setTimeout(30000);

describe('Estadisticas (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<ImcRecord>;
  const testUserId = 7;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          entities: [ImcRecord],
          synchronize: true, // Solo para testing
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        }),
        EstadisticasModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repo = moduleFixture.get<Repository<ImcRecord>>(getRepositoryToken(ImcRecord));
    await app.init();

    // Limpiar y cargar dataset de prueba
    await repo.delete({ user_id: testUserId });

    // Crear un array con todos los registros
    const testRecords = Array.from({ length: 100 }, (_, i) => ({
      pesoKg: 70 + (i % 5),
      alturaM: 1.75,
      imc: (70 + (i % 5)) / (1.75 * 1.75),
      categoria: i % 2 === 0 ? 'Normal' : 'Sobrepeso',
      user_id: testUserId,
      createdAt: new Date(2025, 0, 1 + i),
    }));

    // Insertar todos los registros en una sola operación
    await repo.save(testRecords);
  });

  it('GET /api/estadisticas/promedio', async () => {
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/promedio?user_id=${testUserId}`)
      .expect(200);
    expect(res.body).toHaveProperty('promedio');
  });

  it('GET /api/estadisticas/evolucion', async () => {
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/evolucion?user_id=${testUserId}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/estadisticas/distribucion', async () => {
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/distribucion?user_id=${testUserId}`)
      .expect(200);
    expect(res.body).toHaveProperty('Normal');
  });

  it('GET /api/estadisticas/variacion', async () => {
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/variacion?user_id=${testUserId}`)
      .expect(200);
    expect(res.body).toHaveProperty('variacion_imc');
  });

  it('GET /api/estadisticas/promedio con usuario sin registros devuelve 0', async () => {
    const emptyUserId = 9999;
    // Aseguramos que este usuario no tenga registros
    await repo.delete({ user_id: emptyUserId });
  
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/promedio?user_id=${emptyUserId}`)
      .expect(200);
  
    expect(res.body).toEqual({ promedio: 0 });
  });
  
  it('GET /api/estadisticas/variacion con solo un registro devuelve 0', async () => {
    const singleUserId = 8888;
    await repo.delete({ user_id: singleUserId });
  
    const record = {
      pesoKg: 80,
      alturaM: 1.80,
      imc: 80 / (1.8 * 1.8),
      categoria: 'Normal',
      user_id: singleUserId,
      createdAt: new Date(),
    };
    await repo.save(record);
  
    const res = await request(app.getHttpServer())
      .get(`/estadisticas/variacion?user_id=${singleUserId}`)
      .expect(200);
  
    expect(res.body).toEqual({ variacion_imc: 0 });
  });
  
  it('GET /api/estadisticas/promedio con user_id inválido devuelve 400', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/promedio?user_id=abc')
      .expect(400);
  
    expect(res.body.message).toBe('user_id inválido');
  });
  

  afterAll(async () => {
    await repo.delete({ user_id: testUserId }); // Limpia los datos de prueba
    await app.close();
  });
});