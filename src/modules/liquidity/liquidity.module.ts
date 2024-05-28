import { Module } from '@nestjs/common';

import { LiquidityController } from './liquidity.controller';
import { LiquidityService } from './liquidity.service';

@Module({
  controllers: [LiquidityController],
  providers: [LiquidityService],
  exports: [LiquidityService],
})
export class LiquidityModule {}
