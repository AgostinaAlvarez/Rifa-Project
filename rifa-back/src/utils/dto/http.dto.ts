import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponseDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}
