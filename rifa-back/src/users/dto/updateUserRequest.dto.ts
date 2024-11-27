import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Match } from '../../utils/decorators/match.decorator';
import { IsStrongPassword } from '../../utils/decorators/password.decorator';

export class UpdateUserRequestDto {
  @ApiProperty({ example: 'Jhon Doe' })
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '2023-07-22T14:48:00.000Z' })
  @IsDateString()
  birthday?: Date;

  @ApiProperty({ example: 5492612348972 })
  @IsNumber()
  phone?: number;

  @ApiProperty({ example: 'Be435352fvsds3453' })
  @IsString()
  identificationFull?: string;

  @ApiProperty({ example: 'Password1234!' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Password1234!' })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords must match' })
  confirmPassword: string;
}
