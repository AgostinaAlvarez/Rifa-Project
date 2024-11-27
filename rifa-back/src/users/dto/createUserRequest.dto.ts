import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Match } from '../../utils/decorators/match.decorator';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'user@test.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user@test.com' })
  @IsString()
  @Match('email', { message: 'Emails must match' })
  confirmMail: string;

  @ApiProperty({ example: 'large-string-token' })
  @IsString()
  captchaToken: string;
}
