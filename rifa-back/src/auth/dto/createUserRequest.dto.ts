import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'user@test.com' })
  email: string;
}
