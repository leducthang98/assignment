import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePortfolioRequestDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  pool: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  email: string;
}
