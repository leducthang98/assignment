import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { Connection } from '@solana/web3.js';

jest.mock('@solana/web3.js', () => {
  return {
    Connection: jest.fn().mockImplementation(() => {
      return {
        getBlock: jest.fn(),
      };
    }),
    clusterApiUrl: jest.fn().mockReturnValue('https://api.mainnet-beta.solana.com'),
  };
});

describe('SolanaService', () => {
  let service: SolanaService;
  let connection: jest.Mocked<Connection>;
  let cacheManager: any;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'solana.network': 'mainnet-beta',
        'solana.rpcUrl': null,
      };
      return config[key];
    }),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolanaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<SolanaService>(SolanaService);
    cacheManager = module.get(CACHE_MANAGER);
    connection = (service as any).connection;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBlockTransactionCount', () => {
    it('should call RPC and return transaction count in expected format', async () => {
      const mockBlockNumber = 123456789;
      const mockBlock = {
        transactions: [
          { transaction: 'tx1' },
          { transaction: 'tx2' },
          { transaction: 'tx3' },
        ],
      };

      cacheManager.get.mockResolvedValue(null); // Cache miss
      connection.getBlock = jest.fn().mockResolvedValue(mockBlock);

      const result = await service.getBlockTransactionCount(mockBlockNumber);

      // Verify cache was checked
      expect(cacheManager.get).toHaveBeenCalledWith(`block:${mockBlockNumber}`);

      // Verify RPC was called with correct parameters
      expect(connection.getBlock).toHaveBeenCalledWith(mockBlockNumber, {
        maxSupportedTransactionVersion: 0,
      });

      // Verify result was cached
      expect(cacheManager.set).toHaveBeenCalledWith(`block:${mockBlockNumber}`, {
        blockNumber: mockBlockNumber,
        transactionCount: 3,
      });

      // Verify result is in expected format
      expect(result).toEqual({
        blockNumber: mockBlockNumber,
        transactionCount: 3,
      });
    });

    it('should return cached data when available', async () => {
      const mockBlockNumber = 123456789;
      const cachedData = {
        blockNumber: mockBlockNumber,
        transactionCount: 5,
      };

      cacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getBlockTransactionCount(mockBlockNumber);

      // Verify cache was checked
      expect(cacheManager.get).toHaveBeenCalledWith(`block:${mockBlockNumber}`);

      // Verify RPC was NOT called
      expect(connection.getBlock).not.toHaveBeenCalled();

      // Verify result matches cached data
      expect(result).toEqual(cachedData);
    });

    it('should throw NotFoundException when block is not found', async () => {
      const mockBlockNumber = 999999999;
      cacheManager.get.mockResolvedValue(null);
      connection.getBlock = jest.fn().mockResolvedValue(null);

      await expect(service.getBlockTransactionCount(mockBlockNumber)).rejects.toThrow(
        NotFoundException,
      );

      expect(connection.getBlock).toHaveBeenCalledWith(mockBlockNumber, {
        maxSupportedTransactionVersion: 0,
      });
    });

    it('should handle RPC errors gracefully', async () => {
      const mockBlockNumber = 123456789;
      const errorMessage = 'Network error';
      cacheManager.get.mockResolvedValue(null);
      connection.getBlock = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(service.getBlockTransactionCount(mockBlockNumber)).rejects.toThrow(
        `Failed to fetch block data: ${errorMessage}`,
      );

      expect(connection.getBlock).toHaveBeenCalledWith(mockBlockNumber, {
        maxSupportedTransactionVersion: 0,
      });
    });
  });
});
