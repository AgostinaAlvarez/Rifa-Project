import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfilePictureResponseDto {
  @ApiProperty({ example: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6' })
  profilePictureUrl: string;
}
