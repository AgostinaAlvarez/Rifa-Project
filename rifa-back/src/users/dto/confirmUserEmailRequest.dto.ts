import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmUserEmailRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'token-string' })
  readonly token: string;
}
