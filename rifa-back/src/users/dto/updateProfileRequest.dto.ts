import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty({ example: 'Jhon Doe' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty({ example: '2023-07-22T14:48:00.000Z' })
  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  birthday?: Date;

  @ApiProperty({ example: 5492612348972 })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  phone?: number;

  @ApiProperty({ example: '12151251-8' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  identificationFull?: string;
}
