import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Response } from 'supertest';
import type { AppModule as AppModuleType } from '../src/app.module';
// AppModule is imported dynamically after env is set to allow ConfigModule validation to succeed


describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Ensure required env vars for config validation during tests
    process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

    // Import AppModule after env is configured so ConfigModule.forRoot validate() sees REDIS_URL
    const { AppModule } = (await import('../src/app.module')) as { AppModule: typeof AppModuleType };

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) should return 200 and status ok', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .get('/')
      .expect(200)
      .expect((res: Response) => {
        const body = res.body as Record<string, unknown>;
        expect(body).toHaveProperty('status', 'ok');
        expect(body).toHaveProperty('message');
      });
  });
});
