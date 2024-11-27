import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthDto } from './health.dto';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiOperation({
    summary: 'Ok',
    description: 'Help endpoint to know if the service is operational',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(String),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Get()
  getOk(): string {
    return this.healthService.getOk();
  }

  @ApiOperation({
    summary: 'Health',
    description: 'Endpoint displaying information about the microservice',
  })
  @ApiResponse({ status: HttpStatus.OK, type: HealthDto })
  @Get('/health')
  getHealthCheck(): HealthDto {
    return this.healthService.getHealthCheck();
  }
}
