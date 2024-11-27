import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PasswordRecoveryRequestDto {
  @ApiProperty({ example: 'mailRecovery@example.com' })
  @IsEmail()
  @IsString()
  email: string;
}
