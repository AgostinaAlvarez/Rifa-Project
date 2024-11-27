import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Frecuency } from '../../utils/enums/planFrecuency.enum';
import { BenefitsDto } from './benefits.dto';

export class CreateResponsePlanDto {
  @ApiProperty({ example: 'Monthly' })
  name: string;

  @ApiProperty({ example: 'Brief description of the plan' })
  description?: string;

  @ApiProperty({ example: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6' })
  image?: string;

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

  @ApiProperty({ example: 99000 })
  price: number;

  @ApiProperty({ enum: Frecuency, example: Frecuency.MONTHLY })
  frecuency: Frecuency;

  @ApiProperty({ example: 'plan-1u341evd-n3921bc' })
  mercadoPagoPlanId: string;

  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;
}
