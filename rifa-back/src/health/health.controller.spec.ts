import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [HealthController],
      providers: [HealthService, ConfigService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('root', () => {
    it('should return "Ok!"', () => {
      expect(healthController.getOk()).toBe('Ok!');
    });

    it('should return health', () => {
      expect(healthController.getHealthCheck().service).toBe('rifa-club');
      expect(healthController.getHealthCheck().environment).toBe('test');
    });
  });
});
