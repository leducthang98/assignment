import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Connection, clusterApiUrl } from '@solana/web3.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private connection: Connection;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const network = this.configService.get<string>('solana.network');
    const customRpcUrl = this.configService.get<string>('solana.rpcUrl');
    const rpcUrl = customRpcUrl || clusterApiUrl(network as any);
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    const [redisStatus, solanaStatus] = await Promise.allSettled([
      this.checkRedis(),
      this.checkSolana(),
    ]);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        redis: redisStatus.status === 'fulfilled' ? redisStatus.value : { status: 'down' },
        solana: solanaStatus.status === 'fulfilled' ? solanaStatus.value : { status: 'down' },
      },
    };
  }

  private async checkRedis() {
    try {
      const testKey = 'health:check';
      await this.cacheManager.set(testKey, 'ok', 1000);
      const value = await this.cacheManager.get(testKey);
      return { status: value === 'ok' ? 'up' : 'down' };
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }

  private async checkSolana() {
    try {
      const slot = await this.connection.getSlot();
      return { status: 'up', slot };
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }
}
