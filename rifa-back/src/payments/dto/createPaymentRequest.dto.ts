import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2c93808490c3cfb60190e64a147f0a00' })
  externallId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-07-17T14:21:33.307+00:00' })
  paymentDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2c93808490c3cfb60190e64a147f0a00' })
  subscriptionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '6697d36d3d750b1e60cebf54' })
  user: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '6697d36d3d750b1e60cebf54' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '66993567bac1b6432ca24812' })
  plan: string;
}
