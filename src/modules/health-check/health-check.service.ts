import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import type { HealthCheckResponseDto } from 'src/modules/health-check/dto/health-check.response.dto';

@Injectable()
export class HealthCheckService {
  private redisInstance: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
    );
  }

  async healthCheck(): Promise<HealthCheckResponseDto> {
    const healthCheckOkMessage = 'ok';
    const healthCheckCacheKey = 'HEALTH_CHECK';

    await this.redisInstance.set(healthCheckCacheKey, healthCheckOkMessage);
    const redisHealthCheck: string = await this.redisInstance.get(
      healthCheckCacheKey,
    );

    return {
      appHealthCheck: healthCheckOkMessage,
      redisHealthCheck,
    };
  }
}
