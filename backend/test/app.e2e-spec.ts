import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    if (moduleFixture) {
      await moduleFixture.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should handle non-existent routes with 404', () => {
    return request(app.getHttpServer())
      .get('/non-existent-route')
      .expect(404);
  });

  it('should handle POST to root with 404', () => {
    return request(app.getHttpServer())
      .post('/')
      .expect(404);
  });

  it('should handle PUT to root with 404', () => {
    return request(app.getHttpServer())
      .put('/')
      .expect(404);
  });

  it('should handle DELETE to root with 404', () => {
    return request(app.getHttpServer())
      .delete('/')
      .expect(404);
  });
});