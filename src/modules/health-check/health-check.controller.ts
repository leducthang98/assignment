import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResponseDto } from 'src/modules/health-check/dto/health-check.response.dto';

import { HealthCheckService } from './health-check.service';

const CONTROLLER_NAME = 'health-check';

@Controller(CONTROLLER_NAME)
@ApiTags(CONTROLLER_NAME)
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  async heathCheck(): Promise<HealthCheckResponseDto> {
    return this.healthCheckService.healthCheck();
  }
}
