import { ApiProperty } from '@nestjs/swagger';

class PaymentsImportedDto {
  @ApiProperty({ example: 'example@gmail.com' })
  user: string;

  @ApiProperty({ example: '6695e2e11563509cbce2149e' })
  payment: string;
}

export class MigratePaymentsResponseDto {
  @ApiProperty({
    type: [PaymentsImportedDto],
    description: 'List of successful operations',
  })
  success: PaymentsImportedDto[];
}
