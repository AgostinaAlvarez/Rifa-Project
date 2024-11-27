import { ApiProperty } from '@nestjs/swagger';

class SuccessDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
}

class FailedDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: '2a19615f9eea446dbe2fc71f09d35693' })
  subscriptionId: string;

  @ApiProperty({ example: '2c938084904f7caf019050ab49f9008b' })
  plan: string;

  @ApiProperty({ example: 'doesnt exist a plan with that planId' })
  reason: string;
}

export class MigrateUserResponseDto {
  @ApiProperty({
    type: [SuccessDto],
    description: 'List of successful operations',
  })
  success: SuccessDto[];

  @ApiProperty({
    type: [FailedDto],
    description: 'List of failed operations with details',
  })
  failed: FailedDto[];
}
