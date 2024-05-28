import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FetchPoolDataResponseDto } from 'src/modules/liquidity/dto/fetch-pool-data.response.dto';

import { LiquidityService } from './liquidity.service';

const CONTROLLER_NAME = 'liquidity';

@Controller(CONTROLLER_NAME)
@ApiTags(CONTROLLER_NAME)
export class LiquidityController {
  constructor(private readonly liquidityService: LiquidityService) {}

  @Get('pools')
  async getAvailablePools(): Promise<FetchPoolDataResponseDto[]> {
    return this.liquidityService.fetchPoolData();
  }
}
