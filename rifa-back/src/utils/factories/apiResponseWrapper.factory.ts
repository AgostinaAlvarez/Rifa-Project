import { ApiProperty } from '@nestjs/swagger';

export function apiResponseWrapper(type: any): any {
  class ResponseWrapper {
    @ApiProperty({ type })
    public data: any;
  }

  Object.defineProperty(ResponseWrapper, 'name', {
    value: `ResponseWrapperFor${type.name}`,
  });

  return ResponseWrapper;
}
