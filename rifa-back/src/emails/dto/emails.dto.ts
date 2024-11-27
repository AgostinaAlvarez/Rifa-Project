import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EmailsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  from: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  @ApiProperty()
  @ApiProperty({ type: [String], example: ['test@test.com'] })
  to: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Welcome to example' })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456abcdef' })
  templateId: string;

  @IsOptional()
  @ApiProperty({ example: { name: 'example' } })
  extraPayload?: { [key: string]: string };

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  @ApiProperty({ type: [String], example: ['test@test.com'] })
  cc?: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  @ApiProperty({ type: [String], example: ['test@test.com'] })
  bcc?: string[];
}
