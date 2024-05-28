import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { COMMON_CONSTANT } from './constants/common.constant';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { HttpExceptionFilter } from './shared/filters/exception.filter';
import { ResponseTransformInterceptor } from './shared/interceptors/response.interceptor';
import { AppConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      name: COMMON_CONSTANT.DATASOURCE_DEFAULT_NAMESPACE,
      imports: [SharedModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) =>
        configService.getMysqlConfig(
          COMMON_CONSTANT.DATASOURCE_DEFAULT_NAMESPACE,
        ),
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        config: configService.getRedisConfig(),
      }),
    }),
    SharedModule,
    HealthCheckModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
