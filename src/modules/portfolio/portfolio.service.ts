import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from 'src/constants/exception.constant';
import { PortfolioEntity } from 'src/entities/portfolio.entity';
import { UserEntity } from 'src/entities/user.entity';
import { LiquidityService } from 'src/modules/liquidity/liquidity.service';
import { BaseException } from 'src/shared/filters/exception.filter';
import { Repository } from 'typeorm';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly portfolioRepository: Repository<PortfolioEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly liquidityService: LiquidityService,
  ) {}

  async createPortfolio(pool: string, email: string): Promise<PortfolioEntity> {
    const investmentAmount = 100000;
    // get pool by poolName
    const poolData = await this.liquidityService.getPoolByName(pool);

    if (!poolData) {
      throw new BaseException(ERROR.POOL_NOT_EXIST);
    }

    const user: UserEntity = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const portfolio: PortfolioEntity = new PortfolioEntity();
    portfolio.pool = pool;
    portfolio.userId = user.id;
    portfolio.lpTokens = this.liquidityService.calculatePortfolioTokens(
      investmentAmount,
      poolData.lpTokenPrice,
    );

    return this.portfolioRepository.save(portfolio);
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
