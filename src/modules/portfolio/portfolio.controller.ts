import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PortfolioEntity } from 'src/entities/portfolio.entity';
import { CreatePortfolioRequestDto } from 'src/modules/portfolio/dto/create-portfolio.request.dto';

import { PortfolioService } from './portfolio.service';

const CONTROLLER_NAME = 'portfolio';

@Controller(CONTROLLER_NAME)
@ApiTags(CONTROLLER_NAME)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  async createPortfolio(
    @Body() body: CreatePortfolioRequestDto,
  ): Promise<PortfolioEntity> {
    return this.portfolioService.createPortfolio(
      body.pool,
      body.email,
      body.investmentAmount,
    );
  }

  @Get(':email')
  async getPortfoliosByUserEmail(
    @Param('email') email: string,
  ): Promise<PortfolioEntity[]> {
    return this.portfolioService.findByUserEmail(email);
  }
}
