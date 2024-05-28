import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { Redis } from 'ioredis';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import type { FetchPoolDataResponseDto } from 'src/modules/liquidity/dto/fetch-pool-data.response.dto';

@Injectable()
export class LiquidityService {
  private redisInstance: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
    );
  }

  async fetchPoolData(): Promise<FetchPoolDataResponseDto[]> {
    const poolDataCacheKey = `${COMMON_CONSTANT.APP_NAME.toUpperCase()}_POOLS_DATA`;
    const poolDataExpireTimeSeconds = 12 * 60 * 60; // sync up every 12 hours
    const poolDataCache = await this.redisInstance.get(poolDataCacheKey);

    if (poolDataCache) {
      return JSON.parse(poolDataCache);
    }

    const response = await axios.get(COMMON_CONSTANT.FETCH_POOL_API_URL);

    const pools = response.data.results.map((pool) => ({
      name: pool.name,
      lpTokenPrice: pool.avg_lp_price,
    }));

    await this.redisInstance.set(poolDataCacheKey, JSON.stringify(pools));
    await this.redisInstance.expire(
      poolDataCacheKey,
      poolDataExpireTimeSeconds,
    );

    return pools;
  }

  async getPoolByName(pool: string): Promise<FetchPoolDataResponseDto> {
    const pools = await this.fetchPoolData();
    const findPool = pools.find((e) => e.name === pool);

    return findPool;
  }

  calculatePortfolioTokens(
    investmentAmount: number,
    lpTokenPrice: number,
  ): number {
    return investmentAmount / lpTokenPrice;
  }
}
