import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from 'src/constants/exception.constant';
import { PortfolioEntity } from 'src/entities/portfolio.entity';
import { UserEntity } from 'src/entities/user.entity';
import { LiquidityService } from 'src/modules/liquidity/liquidity.service';
import { BaseException } from 'src/shared/filters/exception.filter';
import type { EntityManager } from 'typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly portfolioRepository: Repository<PortfolioEntity>,
    private readonly liquidityService: LiquidityService,
    private readonly datasource: DataSource,
  ) {}

  async createPortfolio(
    pool: string,
    email: string,
    investmentAmount: number,
  ): Promise<PortfolioEntity> {
    // get pool by poolName
    const poolData = await this.liquidityService.getPoolByName(pool);

    if (!poolData) {
      throw new BaseException(ERROR.POOL_NOT_EXIST);
    }

    let createPortfolio: PortfolioEntity = null;

    await this.datasource.transaction(async (entityManager: EntityManager) => {
      let user: UserEntity = await entityManager.findOne(UserEntity, {
        where: {
          email,
        },
      });

      if (!user) {
        user = await entityManager.save(UserEntity, { email });
      }

      // valdate portfolio
      const isPortfolioExist = await entityManager.exists(PortfolioEntity, {
        where: {
          userId: user.id,
        },
      });

      if (isPortfolioExist) {
        throw new BaseException(ERROR.PORTFOLIO_EXISTED);
      }

      const portfolio: PortfolioEntity = new PortfolioEntity();
      portfolio.pool = pool;
      portfolio.userId = user.id;
      portfolio.lpTokens = this.liquidityService.calculatePortfolioTokens(
        investmentAmount,
        poolData.lpTokenPrice,
      );

      createPortfolio = await entityManager.save(PortfolioEntity, portfolio);
    });

    return createPortfolio;
  }

  async findByUserEmail(email: string): Promise<PortfolioEntity[]> {
    const sql =
      'select p.* from portfolio p left join "user" u on p.user_id = u.id where u.email = $1';
    const portfolioData = await this.portfolioRepository.query(sql, [email]);

    if (!portfolioData || portfolioData.length === 0) {
      throw new BaseException(ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return portfolioData[0];
  }
}
