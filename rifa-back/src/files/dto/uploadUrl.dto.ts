import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'image.png' })
  name: string;

  @IsOptional()
  @ApiProperty({ example: 'profile' })
  folder?: string;
}
