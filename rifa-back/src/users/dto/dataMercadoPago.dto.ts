import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

class DataDto {
  @IsString()
  id: string;
}

export class DataMercadoPagoDto {
  @ApiProperty({ example: 'created' })
  @IsString()
  action: string;

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  application_id: number;

  @ApiProperty({
    example: { id: '38effdc6af1e4f3089cfad14e4afb2e4' },
  })
  @IsObject()
  data: DataDto;

  @ApiProperty({ example: '2024-07-29T14:01:49Z' })
  @IsString()
  date: string;

  @ApiProperty({ example: 'preapproval' })
  @IsString()
  entity: string;

  @ApiProperty({ example: 114957027380 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'subscription_preapproval' })
  @IsString()
  type: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  version: number;
}
