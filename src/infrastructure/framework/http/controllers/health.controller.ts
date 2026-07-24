import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  healthCheck(): object {
    return {
      status: 'ok',
      message: 'GitAgent.AI Backend API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
