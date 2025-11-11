import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('API E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    const cacheManager = app.get(CACHE_MANAGER);
    await cacheManager.store.client.quit();
    await app.close();
  });

  describe('Health Check (GET /health)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('services');
          expect(res.body.services).toHaveProperty('redis');
          expect(res.body.services).toHaveProperty('solana');
        });
    });
  });

  describe('Solana Block Endpoint (GET /solana/block/transaction-count)', () => {
    it('should return transaction count for valid block', () => {
      return request(app.getHttpServer())
        .get('/solana/block/transaction-count?blockNumber=200000000')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('blockNumber');
          expect(res.body).toHaveProperty('transactionCount');
          expect(typeof res.body.transactionCount).toBe('number');
        });
    });

    it('should return error for invalid block number', () => {
      return request(app.getHttpServer())
        .get('/solana/block/transaction-count?blockNumber=invalid')
        .expect(500);
    });

    it('should serve cached responses significantly faster', async () => {
      const blockNumber = '200000001';

      // First request - fetches from Solana
      const start1 = Date.now();
      const firstResponse = await request(app.getHttpServer())
        .get(`/solana/block/transaction-count?blockNumber=${blockNumber}`)
        .expect(200);
      const duration1 = Date.now() - start1;

      // Second request - from cache
      const start2 = Date.now();
      const secondResponse = await request(app.getHttpServer())
        .get(`/solana/block/transaction-count?blockNumber=${blockNumber}`)
        .expect(200);
      const duration2 = Date.now() - start2;

      // Verify both responses are identical
      expect(firstResponse.body).toEqual(secondResponse.body);

      // Cached request should be at least 50% faster
      expect(duration2).toBeLessThan(duration1 * 0.5);
    });
  });
});
