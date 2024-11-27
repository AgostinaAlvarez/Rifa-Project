import { ApiProperty } from '@nestjs/swagger';

export class CreateSuscriptionResponseDto {
  @ApiProperty({
    example:
      'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=2c93808490edce740190ef7e42f5004c',
  })
  initPoint: string;

  @ApiProperty({
    example: '2c93808490edce740190ef7e42f5004c',
  })
  subscriptionId: string;
}
