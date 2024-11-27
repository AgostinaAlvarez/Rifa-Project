import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { FindPaymentsUserResponseDto } from './dto/findPaymentsUserResponse.dto';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { Auth } from '../auth/auth.decorador';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { GetUser } from '../utils/decorators/user.decorator';
import { UserInterface } from '../utils/interface/user.interface';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'payments by user id' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(FindPaymentsUserResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER)
  @Get()
  async getPaymentsByUserId(
    @GetUser() user: UserInterface,
  ): Promise<FindPaymentsUserResponseDto[]> {
    return this.paymentsService.getPaymentsByUserId(user);
  }
}
