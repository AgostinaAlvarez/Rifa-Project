import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Frecuency } from '../../utils/enums/planFrecuency.enum';
import { BenefitsDto } from './benefits.dto';

export class CreatePlanRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Monthly' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Brief description of the plan' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6' })
  image?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BenefitsDto)
  @ApiProperty({
    example: [
      { description: 'This is a benefit', differential: false },
      {
        description: 'This is another benefit but differential',
        differential: true,
      },
    ],
  })
  benefits?: BenefitsDto[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 99000 })
  price: number;

  @IsEnum(Frecuency)
  @IsNotEmpty()
  @ApiProperty({ enum: Frecuency, example: Frecuency.MONTHLY })
  frecuency: Frecuency;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'plan-1u341evd-n3921bc' })
  mercadoPagoPlanId: string;
}
