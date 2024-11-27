import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindPaymentsUserResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '66ba5ef0324c32121c74f238' })
  _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83651887543' })
  externallId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-08-12T19:13:52.301Z' })
  paymentDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '38effdc6af1e4f3089cfad14e4afb2e4' })
  subscriptionId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 950 })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '669aca47584e0432cc18fc19' })
  user: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '6697d36d3d750b1e60cebf54' })
  plan: string;
}
