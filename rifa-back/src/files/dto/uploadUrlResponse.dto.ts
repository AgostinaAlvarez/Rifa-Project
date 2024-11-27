import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadUrlResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'https://BUCKET.s3.amazonaws.com/' })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'https://BUCKET.s3.amazonaws.com/asdkfjhskdjfhksa' })
  publicUrl: string;
}
