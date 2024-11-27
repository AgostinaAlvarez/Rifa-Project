import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class ConfirmUserEmailResponseDto {
  @ApiProperty({ example: '669ac9bd6897420a80af9d93' })
  @IsString()
  _id: string;

  @ApiProperty({ example: 'example@correo.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '2023-07-22T14:48:00.000+00:00' })
  @IsDate()
  emailVerificationAt: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
