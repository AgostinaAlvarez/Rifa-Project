import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfilePictureRequestDto {
  @ApiProperty({ example: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6' })
  @IsString()
  @IsNotEmpty()
  profilePictureUrl: string;
}
