import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResponseDto } from 'src/modules/health-check/dto/health-check.response.dto';

import { HealthCheckService } from './health-check.service';

@Controller('health-check')
@ApiTags('HealthCheck')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  async heathCheck(): Promise<HealthCheckResponseDto> {
    return this.healthCheckService.healthCheck();
  }
}
