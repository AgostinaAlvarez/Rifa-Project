import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error.dto';

export function apiErrorWrapper(type: any): any {
  class ResponseWrapper {
    @ApiProperty({ type })
    public error: ErrorResponseDto;
  }

  Object.defineProperty(ResponseWrapper, 'name', {
    value: `ResponseWrapperFor${type.name}`,
  });

  return ResponseWrapper;
}
