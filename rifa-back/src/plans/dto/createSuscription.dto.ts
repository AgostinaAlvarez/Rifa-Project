import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateSuscriptionRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '328116179f8eb27eba6d5a331e71bd30' })
  cardTokenId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@example.com' })
  payerEmail: string;
}
