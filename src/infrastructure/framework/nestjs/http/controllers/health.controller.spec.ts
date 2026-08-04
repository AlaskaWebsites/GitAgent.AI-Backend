import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  type HealthResponse = {
    status: string;
    message: string;
    timestamp: string;
  };

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should return status ok and include message/timestamp', () => {
    const res = controller.healthCheck() as HealthResponse;
    expect(res.status).toBe('ok');
    expect(typeof res.message).toBe('string');
    expect(typeof res.timestamp).toBe('string');
  });
});
