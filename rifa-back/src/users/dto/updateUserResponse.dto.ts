import { ApiProperty } from '@nestjs/swagger';

class PlanBenefitsDto {
  @ApiProperty({ example: false })
  differential: boolean;

  @ApiProperty({ example: 'some description of plan' })
  description: string;
}

export class PlanDto {
  @ApiProperty({ example: 'string-id' })
  _id: string;

  @ApiProperty({ example: 'name plan' })
  name: string;

  @ApiProperty({
    example: 'string url',
  })
  image: string;

  @ApiProperty({ type: [PlanBenefitsDto] })
  benefits: PlanBenefitsDto[];

  @ApiProperty({ example: 99000 })
  price: number;

  @ApiProperty({ example: 'monthly-annual' })
  frecuency: string;

  @ApiProperty({ example: 'string-id' })
  mercadoPagoPlanId: string;

  @ApiProperty({ example: '2024-07-22T14:00:05.858Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-07-22T14:00:05.858Z' })
  updatedAt: string;
}

export class UpdateUserResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ example: 'name user' })
  fullName?: string;

  @ApiProperty({ type: PlanDto })
  plan: PlanDto;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthday?: Date;

  @ApiProperty()
  identificationFull?: string;

  @ApiProperty()
  phone?: number;

  @ApiProperty()
  isFinishedSuscription: boolean;

  @ApiProperty()
  finishedSuscriptionAt: Date;
}
