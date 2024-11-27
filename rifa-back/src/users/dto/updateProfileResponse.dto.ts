import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto {
  @ApiProperty({ example: 'Jose Perez' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '2024-08-05T15:38:31.788Z' })
  @IsDateString()
  birthday?: Date;

  @ApiProperty({ example: 12351252 })
  @IsNumber()
  phone?: number;

  @ApiProperty({ example: '12151251-8' })
  @IsString()
  identificationFull?: string;

  @ApiProperty({ example: 'string-token' })
  @IsString()
  token: string;
}
