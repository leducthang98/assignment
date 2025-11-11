import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetBlockTransactionCountDto {
  @ApiProperty({ example: '200000000' })
  @IsNotEmpty()
  @IsNumberString()
  blockNumber: string;
}

export class BlockTransactionCountResponseDto {
  @ApiProperty({ example: 200000000 })
  blockNumber: number;

  @ApiProperty({ example: 1234 })
  transactionCount: number;
}
