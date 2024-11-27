import {
  Controller,
  Request,
  UseGuards,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { LogoutResponseDto } from './dto/logoutResponse.dto';
import { UserInterface } from '../utils/interface/user.interface';
import { Auth } from './auth.decorador';
import { GetUser } from '../utils/decorators/user.decorator';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login users',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(LoginResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'User has not completed onboarding',
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @Post('signin')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async login(@Request() req: any): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(LogoutResponseDto),
    description: 'User had been logout',
  })
  @Auth()
  @Post('logout')
  async logout(@GetUser() user: UserInterface): Promise<void> {
    return this.authService.logout(user);
  }

  @ApiOperation({
    summary: 'Validate Token',
  })
  @Auth()
  @Post('validate-token')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validateToken(@GetUser() user: UserInterface): Promise<UserInterface> {
    return this.authService.validateToken(user);
  }
}
