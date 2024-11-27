import { Body, Controller, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CaptchasService } from '../captchas/captchas.service';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { ConfirmUserEmailRequestDto } from './dto/confirmUserEmailRequest.dto';
import { ConfirmUserEmailResponseDto } from './dto/confirmUserEmailResponse.dto';
import { GetUser } from '../utils/decorators/user.decorator';
import { UserInterface } from '../utils/interface/user.interface';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { Roles } from '../utils/decorators/roles.decorator';
import { Auth } from '../auth/auth.decorador';
import { Role } from '../utils/enums/role.enum';
import { UpdateUserResponseDto } from './dto/updateUserResponse.dto';
import { DataMercadoPagoDto } from './dto/dataMercadoPago.dto';
import { PasswordRecoveryRequestDto } from './dto/passwordRecoveryRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';
import { UpdateProfileRequestDto } from './dto/updateProfileRequest.dto';
import { UpdateProfileResponseDto } from './dto/updateProfileResponse.dto';
import { UpdateProfilePictureResponseDto } from './dto/updateProfilePictureResponse.dto';
import { UpdateProfilePictureRequestDto } from './dto/updateProfilePictureRequest.dto';
import { ChangePasswordRequestDto } from './dto/changePasswordRequest.dto';
import { MigrateUserResponseDto } from './dto/migrateUserResponse.dto';
import { ChangePasswordResponseDto } from './dto/changePasswordResponse.dto';
import { MigratePaymentsResponseDto } from './dto/migratePaymentsResponse.dto';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly captchasService: CaptchasService,
  ) {}

  @ApiOperation({ summary: 'Pre sign up with email' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateUserResponseDto),
    description: 'User create success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Not acceptable captcha',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Post('pre-signup')
  async createUser(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    await this.captchasService.handleSend(createUserDto.captchaToken);
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Confirm email with user token',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(ConfirmUserEmailResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'Invalid or expired confirmation token',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'User already confirmed',
  })
  @Post('confirm-email')
  async confirmUserEmail(
    @Body() data: ConfirmUserEmailRequestDto,
  ): Promise<ConfirmUserEmailResponseDto> {
    return this.userService.confirmEmail(data.token);
  }

  @ApiOperation({ summary: 'Complete register sign up' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(UpdateUserResponseDto),
    description: 'User sign-up success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.BASIC_USER)
  @Put('signup')
  async completeData(
    @Body() updateUser: UpdateUserRequestDto,
    @GetUser() user: UserInterface,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.completeData(user, updateUser);
  }

  @ApiOperation({
    summary: 'Send email for reset password',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(ConfirmUserEmailResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Post('password-recovery')
  async passwordRecovery(
    @Body() data: PasswordRecoveryRequestDto,
  ): Promise<boolean> {
    return this.userService.passwordRecovery(data);
  }

  @ApiOperation({
    summary: 'Reset password with token',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(ChangePasswordResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'Token not found',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Put('password-reset')
  async resetPassword(
    @Body() data: ResetPasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.userService.passwordReset(data);
  }

  @ApiOperation({ summary: 'Mercado Pago Webhook' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: Boolean,
    description: 'Event Received',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Post('events-mercadopago')
  async receiveEvent(
    @Query('type') type?: string,
    @Body() dataMercadoPago?: DataMercadoPagoDto,
  ): Promise<boolean> {
    return this.userService.receiveEvent(dataMercadoPago, type);
  }

  @ApiOperation({ summary: 'Cancel user subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: 'Cancelled Subscription',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER, Role.BASIC_USER)
  @Post('cancel-subscription')
  async cancelSubscription(@GetUser() user: UserInterface): Promise<boolean> {
    return this.userService.cancelSubscription(user);
  }

  @ApiOperation({ summary: 'Pause user subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: 'Paused Subscription',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER, Role.BASIC_USER)
  @Post('pause-subscription')
  async pauseSubscription(@GetUser() user: UserInterface): Promise<boolean> {
    return this.userService.pauseSubscription(user);
  }

  @ApiOperation({ summary: 'update profile data' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(UpdateProfileResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER)
  @Put('profile')
  async updateProfile(
    @GetUser() user: UserInterface,
    @Body() data: UpdateProfileRequestDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.userService.updateProfile(user, data);
  }

  @ApiOperation({ summary: 'update profile picture' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(UpdateProfilePictureResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER)
  @Put('profile-picture')
  async updateProfilePicture(
    @GetUser() user: UserInterface,
    @Body() url: UpdateProfilePictureRequestDto,
  ): Promise<UpdateProfilePictureResponseDto> {
    return this.userService.updateProfilePicture(user, url);
  }

  @ApiOperation({ summary: 'change password' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: Boolean,
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Passwords must match or must be complete the rules',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Current password is wrong',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.FULL_USER)
  @Put('password-change')
  async changePassword(
    @GetUser() user: UserInterface,
    @Body() data: ChangePasswordRequestDto,
  ): Promise<boolean> {
    return this.userService.changePassword(user, data);
  }

  @ApiOperation({ summary: 'migrate users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(MigrateUserResponseDto),
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
  @Roles(Role.ADMIN)
  @Post('migrate-users')
  async migrateUsers(): Promise<MigrateUserResponseDto> {
    return this.userService.migrateUsers();
  }

  @ApiOperation({ summary: 'migrate payments' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(MigratePaymentsResponseDto),
    description: 'Payments created',
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
  @Roles(Role.ADMIN)
  @Post('migrate-payments')
  async migratePayments(): Promise<MigratePaymentsResponseDto> {
    return this.userService.migratePayments();
  }
}
