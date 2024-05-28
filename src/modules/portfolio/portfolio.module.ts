import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { PortfolioEntity } from 'src/entities/portfolio.entity';
import { UserEntity } from 'src/entities/user.entity';
import { LiquidityModule } from 'src/modules/liquidity/liquidity.module';

import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

const entities = [UserEntity, PortfolioEntity];

@Module({
  imports: [
    TypeOrmModule.forFeature(
      entities,
      COMMON_CONSTANT.DATASOURCE_DEFAULT_NAMESPACE,
    ),
    LiquidityModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
