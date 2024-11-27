import { ApiProperty } from '@nestjs/swagger';
import { PlanDto } from '../../users/dto/updateUserResponse.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'Jason Dohe' })
  fullName: string;

  @ApiProperty({ type: PlanDto })
  plan: PlanDto;

  @ApiProperty({ example: 'string-token' })
  token: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthday?: Date;

  @ApiProperty()
  identificationFull?: string;

  @ApiProperty()
  phone?: number;

  @ApiProperty()
  isFinishedSuscription?: boolean;

  @ApiProperty()
  finishedSuscriptionAt?: Date;
}
