import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../utils/decorators/match.decorator';
import { IsStrongPassword } from '../../utils/decorators/password.decorator';

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'Auto1025.' })
  @IsStrongPassword()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Auto1025.' })
  @IsString()
  @Match('password', { message: 'password must match' })
  confirmPassword: string;

  @ApiProperty({ example: 'string-token' })
  @IsString()
  token: string;
}
