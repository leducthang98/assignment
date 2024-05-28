import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { PortfolioEntity } from 'src/entities/portfolio.entity';
import { UserEntity } from 'src/entities/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

const entities = [UserEntity, PortfolioEntity];

@Module({
  imports: [
    TypeOrmModule.forFeature(
      entities,
      COMMON_CONSTANT.DATASOURCE_DEFAULT_NAMESPACE,
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
