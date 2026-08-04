import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
const request = require('supertest');
// AppModule is imported dynamically after env is set to allow ConfigModule validation to succeed


describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Ensure required env vars for config validation during tests
    process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

    // Import AppModule after env is configured so ConfigModule.forRoot validate() sees REDIS_URL
    const module = require('../src/app.module');
    const { AppModule } = module;

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) should return 200 and status ok', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('message');
      });
  });
});
