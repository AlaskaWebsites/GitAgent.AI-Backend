import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './infrastructure/framework/nestjs/config/env.validation';
import { HealthModule } from './infrastructure/framework/nestjs/modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
