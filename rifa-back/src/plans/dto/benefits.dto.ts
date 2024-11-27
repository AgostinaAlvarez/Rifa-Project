import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class BenefitsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Monthly' })
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: false })
  differential: boolean;
}
