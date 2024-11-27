import { ApiProperty } from '@nestjs/swagger';

export function apiResponseArrayWrapper(type: any): any {
  class ResponseWrapperArray {
    @ApiProperty({ type: [type] })
    public data: any[];
  }

  Object.defineProperty(ResponseWrapperArray, 'name', {
    value: `ResponseWrapperArrayFor${type.name}`,
  });

  return ResponseWrapperArray;
}
