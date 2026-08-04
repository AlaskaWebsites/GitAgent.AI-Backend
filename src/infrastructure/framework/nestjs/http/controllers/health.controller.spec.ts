import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should return status ok and include message/timestamp', () => {
    const res = controller.healthCheck();
    expect(res).toHaveProperty('status', 'ok');
    expect(res).toHaveProperty('message');
    expect(res).toHaveProperty('timestamp');
    expect(typeof res.timestamp).toBe('string');
  });
});
