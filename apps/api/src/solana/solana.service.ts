import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Connection, clusterApiUrl } from '@solana/web3.js';

@Injectable()
export class SolanaService {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const network = this.configService.get<string>('solana.network');
    const customRpcUrl = this.configService.get<string>('solana.rpcUrl');
    const rpcUrl = customRpcUrl || clusterApiUrl(network as any);
    this.connection = new Connection(rpcUrl, 'confirmed');

    this.logger.log(`Connected to Solana ${network}`);
  }

  async getBlockTransactionCount(blockNumber: number): Promise<{ blockNumber: number; transactionCount: number }> {
    const cacheKey = `block:${blockNumber}`;

    try {
      const cached = await this.cacheManager.get<{ blockNumber: number; transactionCount: number }>(cacheKey);
      if (cached) {
        return cached;
      }

      const block = await this.connection.getBlock(blockNumber, {
        maxSupportedTransactionVersion: 0,
      });

      if (!block) {
        throw new NotFoundException(`Block ${blockNumber} not found`);
      }

      const result = {
        blockNumber,
        transactionCount: block.transactions.length,
      };

      await this.cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch block data: ${error.message}`);
    }
  }
}
