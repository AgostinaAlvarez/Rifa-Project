import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  onlySignupPending: boolean;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}
