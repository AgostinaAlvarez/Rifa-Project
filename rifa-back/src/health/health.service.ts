import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HealthDto } from './health.dto';

@Injectable()
export class HealthService {
  constructor(private configService: ConfigService) {}

  getHealthCheck(): HealthDto {
    return {
      nodeVersion: process.version,
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV'),
      service: process.env.npm_package_name,
      appVersionPackage: process.env.npm_package_version,
    };
  }

  getOk(): string {
    return 'Ok!';
  }
}
