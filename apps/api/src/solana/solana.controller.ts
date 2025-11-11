import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SolanaService } from './solana.service';
import { BlockTransactionCountResponseDto } from './dto/get-block-transaction-count.dto';

@ApiTags('solana')
@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  @Get('block/transaction-count')
  @ApiOperation({ summary: 'Get transaction count for a block' })
  @ApiQuery({
    name: 'blockNumber',
    required: true,
    type: String,
    example: '200000000',
  })
  @ApiResponse({
    status: 200,
    type: BlockTransactionCountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Block not found' })
  async getBlockTransactionCount(
    @Query('blockNumber') blockNumber: string,
  ): Promise<BlockTransactionCountResponseDto> {
    const blockNum = parseInt(blockNumber, 10);
    return this.solanaService.getBlockTransactionCount(blockNum);
  }
}
