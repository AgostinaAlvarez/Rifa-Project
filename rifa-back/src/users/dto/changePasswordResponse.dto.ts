import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ChangePasswordResponseDto {
  @ApiProperty({ example: 'example@correo.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ example: '66b26a2ef103e25a74a8b886' })
  @IsString()
  _id: string;
}
