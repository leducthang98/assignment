import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('portfolio')
export class PortfolioEntity extends BaseEntity {
  @Column({
    nullable: true,
    type: 'float',
    name: 'lp_tokens',
  })
  lpTokens: number;

  @Column({
    nullable: true,
    name: 'pool',
  })
  pool: string;

  @Column({
    nullable: true,
    name: 'user_id',
  })
  userId: number;
}
