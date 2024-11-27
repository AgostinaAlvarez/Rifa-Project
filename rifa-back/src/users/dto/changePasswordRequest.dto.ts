import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Match } from '../../utils/decorators/match.decorator';
import { IsStrongPassword } from '../../utils/decorators/password.decorator';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'Auto1234.' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'Moto4321.' })
  @IsStrongPassword()
  @IsString()
  newPassword: string;

  @ApiProperty({ example: 'Moto4321.' })
  @IsString()
  @Match('newPassword', { message: 'Passwords must match' })
  confirmPassword: string;
}
