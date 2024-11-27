/* eslint-disable no-underscore-dangle */
import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { Logger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { Payment, PreApproval } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from '../utils/interface/user.interface';
import { BCRYPT } from '../bcrypt/bcrypt.const';
import { Bcrypt } from '../bcrypt/bcrypt.provider';
import { Emails } from '../emails/interfaces/emails.interface';
import { EMAIL_PROVIDER } from '../emails/constants/emailProviders.constant';
import { Role } from '../utils/enums/role.enum';
import { User } from './users.model';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
// eslint-disable-next-line import/no-cycle
import { AuthService } from '../auth/auth.service';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { DateHandlerProvider } from '../utils/providers/dayjs/dateHandler.provider';
import {
  MERCADO_PAGO_PAYMENTS_PROVIDER,
  MERCADO_PAGO_PREAPPROVAL_PROVIDER,
} from '../mercado-pago/mercado-pago.constants';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { UpdateUserResponseDto } from './dto/updateUserResponse.dto';
import { PasswordRecoveryRequestDto } from './dto/passwordRecoveryRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';
import { PaymentStatus } from '../utils/enums/paymentStatus.enum';
import { DataMercadoPagoDto } from './dto/dataMercadoPago.dto';
import { UpdateProfileRequestDto } from './dto/updateProfileRequest.dto';
import { UpdateProfileResponseDto } from './dto/updateProfileResponse.dto';
import { UpdateProfilePictureResponseDto } from './dto/updateProfilePictureResponse.dto';
import { UpdateProfilePictureRequestDto } from './dto/updateProfilePictureRequest.dto';
import { ChangePasswordRequestDto } from './dto/changePasswordRequest.dto';
import { ConfirmUserEmailResponseDto } from './dto/confirmUserEmailResponse.dto';
// eslint-disable-next-line import/no-cycle
import { PlanService } from '../plans/plans.service';
import { MigrateUserResponseDto } from './dto/migrateUserResponse.dto';
import { ChangePasswordResponseDto } from './dto/changePasswordResponse.dto';
import { PaymentsService } from '../payments/payments.service';
import { MigratePaymentsResponseDto } from './dto/migratePaymentsResponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService,
    @Inject(EMAIL_PROVIDER) private emailProvider: Emails,
    private readonly configService: ConfigService,
    @Inject(BCRYPT)
    public bcryptProvider: Bcrypt,
    @Inject(MERCADO_PAGO_PREAPPROVAL_PROVIDER) private mercadoPago: PreApproval,
    @Inject(MERCADO_PAGO_PAYMENTS_PROVIDER)
    private mercadoPagoPayments: Payment,
    @Inject(Logger) private readonly logger: Logger,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly dateHandler: DateHandlerProvider,
    private readonly planService: PlanService,
  ) {}

  async findByEmail(
    email: string,
    needpopulate = false,
  ): Promise<DocumentType<User>> {
    const query = this.userModel.findOne({ email });
    if (needpopulate) {
      query.populate('plan');
    }
    return query.exec();
  }

  generateVerificationToken(): string {
    return `RC.${this.bcryptProvider.genSaltSync()}`;
  }

  async findByConfirmationToken(token: string): Promise<User | undefined> {
    return this.userModel.findOne({ tokenEmailVerification: token });
  }

  async findByEmailToken(token: string): Promise<User | undefined> {
    return this.userModel.findOne({ tokenEmailRecovery: token });
  }

  async confirmEmailUserData(userId: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isActive: true,
          emailVerificationAt: new Date(),
        },
      },
      { new: true },
    );
    return updatedUser;
  }

  async updateUserPassword(userId: string, password: string): Promise<boolean> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          password,
        },
      },
    );
    return true;
  }

  async updateTokenConfirmationUser(
    userId: string,
    newToken: string,
  ): Promise<boolean> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          tokenEmailVerification: newToken,
          tokenEmailVerificationCreatedAt: new Date(),
        },
      },
    );
    return true;
  }

  async createTokenEmailUser(
    userId: string,
    tokenEmail: string,
  ): Promise<boolean> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          tokenEmailRecovery: tokenEmail,
          tokenEmailRecoveryCreatedAt: new Date(),
        },
      },
    );
    return true;
  }

  async confirmEmail(token: string): Promise<ConfirmUserEmailResponseDto> {
    const user = await this.findByConfirmationToken(token);
    if (!user) {
      throw new HttpException(
        'Invalid or expired confirmation token',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    if (user.isActive) {
      throw new HttpException('User already confirmed', HttpStatus.CONFLICT);
    }
    const tokenExpiration = this.configService.get<number>(
      'TOKEN_EXPIRATION_HOURS',
    );
    const tokenCreatedAt = new Date(user.tokenEmailVerificationCreatedAt);
    const now = new Date();

    const diffInHours = this.dateHandler.diff(now, tokenCreatedAt, 'hour');

    if (diffInHours > tokenExpiration) {
      throw new HttpException(
        'Invalid or expired confirmation token',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const userIdAsString = user._id.toString();
    const updateData = await this.confirmEmailUserData(userIdAsString);
    const response = {
      _id: updateData._id.toHexString(),
      email: updateData.email,
      emailVerificationAt: updateData.emailVerificationAt,
      isActive: updateData.isActive,
    };
    return response;
  }

  async updateUserSubscription(
    paymentStatus: PaymentStatus,
    subscriptionId: string,
    planId: string,
    userId: string,
  ): Promise<boolean> {
    const updateData = {
      paymentStatus,
      subscriptionId,
      plan: planId,
    };

    const updateSubscription = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
    );

    return !!updateSubscription;
  }

  mapMercadoPagoStatusToPaymentStatus(status: string): PaymentStatus {
    switch (status) {
      case 'authorized':
        return PaymentStatus.AUTHORIZED;
      case 'pending':
        return PaymentStatus.PENDING;
      case 'paused':
        return PaymentStatus.PAUSED;
      case 'cancelled':
        return PaymentStatus.CANCELLED;
      default:
        throw new Error(`Unknown payment status: ${status}`);
    }
  }

  async findUserBySubscriptionId(subscriptionId: string): Promise<User | null> {
    return this.userModel.findOne({ subscriptionId });
  }

  async receiveEvent(
    dataMercadoPago: DataMercadoPagoDto,
    type?: string,
  ): Promise<boolean> {
    if (
      type === 'subscription_preapproval' &&
      (dataMercadoPago.action === 'created' ||
        dataMercadoPago.action === 'updated')
    ) {
      const checkId = dataMercadoPago.data.id;
      const user = await this.findUserBySubscriptionId(checkId);

      if (user) {
        const response = await this.mercadoPago.get({ id: checkId });
        const newStatus = this.mapMercadoPagoStatusToPaymentStatus(
          response.status,
        );
        const updateData = {
          paymentStatus: newStatus,
          updatedStatusSubscriptionAt: new Date(),
        };

        await this.userModel.findByIdAndUpdate(user._id, updateData);

        return true;
      }
    } else if (type === 'payment') {
      const paymentId = dataMercadoPago.data.id;

      const payment = await this.mercadoPagoPayments.get({ id: paymentId });

      const paymentAny = payment as any;

      if (payment.status === 'approved') {
        const user = await this.findUserBySubscriptionId(
          paymentAny.point_of_interaction.transaction_data.subscription_id,
        );

        if (user) {
          await this.paymentsService.createPayment({
            externallId: paymentId,
            paymentDate: new Date(payment.date_approved),
            subscriptionId:
              paymentAny.point_of_interaction.transaction_data.subscription_id,
            amount: payment.transaction_amount,
            user: user._id.toString(),
            plan: user.plan.toString(),
          });
        }
      }
      return true;
    }
    return true;
  }

  async completeData(
    user: UserInterface,
    updateUser: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const saltOrRounds = this.configService.get<number>(
      'BCRYPT_SALT_OR_ROUNDS',
    );
    const hashedPassword = this.bcryptProvider.hashSync(
      updateUser.password,
      saltOrRounds,
    );
    const updateData = {
      ...updateUser,
      roles: [Role.FULL_USER],
      password: hashedPassword,
      isFinishedSuscription: true,
      finishedSuscriptionAt: new Date(),
    };

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user._id,
        { $set: updateData },
        {
          new: true,
        },
      )
      .populate('plan');

    const planObj = updatedUser.toObject();
    const plainUserObj = {
      _id: updatedUser._id,
      email: updatedUser.email,
      roles: updatedUser.roles,
      plan: updatedUser.plan,
    };
    const token = this.authService.sign(plainUserObj);
    const response = {
      token,
      fullName: updatedUser.fullName,
      plan: planObj.plan,
      _id: updatedUser._id.toHexString(),
      email: updatedUser.email,
      birthday: updatedUser.birthday,
      identificationFull: updatedUser.identificationFull,
      phone: updatedUser.phone,
      isFinishedSuscription: updatedUser.isFinishedSuscription,
      finishedSuscriptionAt: updatedUser.finishedSuscriptionAt,
    };
    return response;
  }

  async create(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const existUser = await this.findByEmail(createUserDto.email);
    if (existUser) {
      if (existUser.roles.includes(Role.BASIC_USER)) {
        return this.handleExistingBasicUser(existUser);
      }
      throw new ConflictException('Email already exists');
    }
    return this.handleNewUser(createUserDto);
  }

  async updateProfile(
    user: UserInterface,
    data: UpdateProfileRequestDto,
  ): Promise<UpdateProfileResponseDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      { $set: data },
      {
        new: true,
      },
    );
    const jwtToken = this.generateResponseJwt(updatedUser);
    const response: UpdateProfileResponseDto = {
      fullName: updatedUser.fullName,
      birthday: updatedUser.birthday,
      phone: updatedUser.phone,
      identificationFull: updatedUser.identificationFull,
      token: jwtToken,
    };
    return response;
  }

  async handleExistingBasicUser(user: User): Promise<CreateUserResponseDto> {
    let jwtToken: string;
    if (!user.isActive) {
      const token = this.generateVerificationToken();
      await this.updateTokenConfirmationUser(user._id.toString(), token);
      await this.sendVerificationEmail(user, token);
      jwtToken = this.generateResponseJwt(user);
    } else {
      jwtToken = this.generateResponseJwt(user);
    }
    return {
      token: jwtToken,
      onlySignupPending: user.plan && user.roles.includes(Role.BASIC_USER),
      _id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async handleNewUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const defaultRole: Role = Role.BASIC_USER;
    const token = this.generateVerificationToken();

    const newUser = await this.userModel.create({
      ...createUserDto,
      roles: [defaultRole],
      tokenEmailVerification: token,
      tokenEmailVerificationCreatedAt: new Date(),
    });

    await this.sendVerificationEmail(newUser, token);
    const jwtToken = this.generateResponseJwt(newUser);
    return {
      token: jwtToken,
      onlySignupPending:
        newUser.plan && newUser.roles.includes(Role.BASIC_USER),
      _id: newUser._id.toHexString(),
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    const sender = this.configService.get<string>('FROM_EMAIL');
    const templateIdPreSignUp = this.configService.get<string>(
      'TEMPLATE_ID_PRE_SIGN_UP',
    );
    const hostRifaClub = this.configService.get<string>('HOST_RIFA_CLUB');
    const urlRedirectWithToken = `${hostRifaClub}/verify?token=${token}`;
    const socialMediaInstagram = this.configService.get<string>(
      'SOCIAL_MEDIA_INSTAGRAM',
    );

    const emailData = {
      from: sender,
      to: [user.email],
      subject: '¡Felicidades!',
      templateId: templateIdPreSignUp,
      extraPayload: {
        urlRedirectWithToken,
        socialMediaInstagram,
      },
    };
    await this.emailProvider.send(emailData);
  }

  async sendRecoveryPasswordEmail(user: User, token: string): Promise<void> {
    const sender = this.configService.get<string>('FROM_EMAIL');
    const templateIdRecoverPass = this.configService.get<string>(
      'TEMPLATE_ID_RECOVERY_PASSWORD',
    );
    const hostRifaClub = this.configService.get<string>('HOST_RIFA_CLUB');
    const urlRedirectWithToken = `${hostRifaClub}/password-reset?token=${token}`;
    const socialMediaInstagram = this.configService.get<string>(
      'SOCIAL_MEDIA_INSTAGRAM',
    );
    const tokenExpiration = this.configService.get<number>(
      'TOKEN_EXPIRATION_HOURS_PASS_RECOVERY',
    );
    const hsExpirationToken = tokenExpiration.toString();

    const emailData = {
      from: sender,
      to: [user.email],
      subject: '¡Restablece tu contraseña!',
      templateId: templateIdRecoverPass,
      extraPayload: {
        urlRedirectWithToken,
        socialMediaInstagram,
        hsExpirationToken,
      },
    };
    await this.emailProvider.send(emailData);
  }

  generateResponseJwt(user: User): string {
    const payload = {
      email: user.email,
      _id: user._id,
      roles: user.roles,
      planId: user.plan,
    };
    const token = this.authService.sign(payload);
    return token;
  }

  async passwordRecovery(data: PasswordRecoveryRequestDto): Promise<boolean> {
    const user = await this.findByEmail(data.email);
    if (!user) return true;
    const token = this.generateVerificationToken();
    const status = await this.createTokenEmailUser(user._id.toString(), token);
    await this.sendRecoveryPasswordEmail(user, token);
    return status;
  }

  async passwordReset(
    data: ResetPasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    const user = await this.findByEmailToken(data.token);
    if (!user) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    const tokenExpiration = this.configService.get<number>(
      'TOKEN_EXPIRATION_HOURS_PASS_RECOVERY',
    );
    const tokenCreatedAt = new Date(user.tokenEmailRecoveryCreatedAt);
    const now = new Date();

    const diffInHours = this.dateHandler.diff(now, tokenCreatedAt, 'hour');
    if (diffInHours > tokenExpiration) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const saltOrRounds = this.configService.get<number>(
      'BCRYPT_SALT_OR_ROUNDS',
    );
    const hashedPassword = this.bcryptProvider.hashSync(
      data.password,
      saltOrRounds,
    );
    const status = await this.updateUserPassword(
      user._id.toString(),
      hashedPassword,
    );
    return { status, email: user.email, _id: user._id.toHexString() };
  }

  async cancelSubscription(user: UserInterface): Promise<boolean> {
    const userComplete = await this.userModel.findById(user._id);

    const body = {
      status: PaymentStatus.CANCELLED,
    };

    const id = userComplete.subscriptionId;
    try {
      await this.mercadoPago.update({ id, body });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new PreconditionFailedException(
        `Payment creation failed: ${error.message || error}`,
      );
    }
  }

  async pauseSubscription(user: UserInterface): Promise<boolean> {
    const userComplete = await this.userModel.findById(user._id);

    const body = {
      status: PaymentStatus.PAUSED,
    };

    const id = userComplete.subscriptionId;
    try {
      await this.mercadoPago.update({ id, body });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new PreconditionFailedException(
        `Payment creation failed: ${error.message || error}`,
      );
    }
  }

  async updateProfilePicture(
    user: UserInterface,
    url: UpdateProfilePictureRequestDto,
  ): Promise<UpdateProfilePictureResponseDto> {
    const id = user._id;
    const updateData = {
      profileImageUrl: url.profilePictureUrl,
    };

    const userUpdated = await this.userModel.findByIdAndUpdate(
      { _id: id },
      updateData,
      { new: true },
    );

    return { profilePictureUrl: userUpdated.profileImageUrl };
  }

  async changePassword(
    user: UserInterface,
    data: ChangePasswordRequestDto,
  ): Promise<boolean> {
    const userFound = await this.findByEmail(user.email);
    const isPasswordCorrect = this.bcryptProvider.compareSync(
      data.currentPassword,
      userFound.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Current password is wrong',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const saltOrRounds = this.configService.get<number>(
      'BCRYPT_SALT_OR_ROUNDS',
    );
    const hashedPassword = this.bcryptProvider.hashSync(
      data.newPassword,
      saltOrRounds,
    );
    const status = await this.updateUserPassword(
      user._id.toString(),
      hashedPassword,
    );
    return status;
  }

  async getPaymentsMigrateUsers(): Promise<any> {
    const payments = await this.mercadoPagoPayments.search();
    const arrayPayments = payments.results;

    const users = arrayPayments
      .map((pago) => {
        const email = pago.payer.email || null;

        const pointOfInteraction = pago as any;
        let subscriptionId = null;
        if (
          pointOfInteraction.point_of_interaction &&
          pointOfInteraction.point_of_interaction.transaction_data
        ) {
          subscriptionId =
            pointOfInteraction.point_of_interaction.transaction_data
              .subscription_id || null;
        }

        return {
          email,
          subscriptionId,
        };
      })
      .filter((user) => user.subscriptionId !== null);
    return users;
  }

  async getSubscriptionMigrateUsers(): Promise<any> {
    const users = await this.getPaymentsMigrateUsers();
    const validUsers: any[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const user of users) {
      const { email, subscriptionId } = user;

      if (email && subscriptionId) {
        try {
          const userPlan: any = await this.mercadoPago.get({
            id: subscriptionId,
          });
          const plan = userPlan?.preapproval_plan_id || null;
          const paymentStatus = userPlan?.status || null;

          if (plan && paymentStatus) {
            validUsers.push({
              email,
              subscriptionId,
              plan,
              paymentStatus,
            });
          }
        } catch (error) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }
    }

    return validUsers;
  }

  async migrateUsers(): Promise<MigrateUserResponseDto> {
    const users = await this.getSubscriptionMigrateUsers();
    const success: any[] = [];
    const failed: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const userData of users) {
      const validationSubscription = await this.findUserBySubscriptionId(
        userData.subscriptionId,
      );
      const validationEmail = await this.userModel.findOne({
        email: userData.email,
      });
      if (validationSubscription || validationEmail) {
        failed.push({
          email: userData.email,
          subscriptionId: userData.subscriptionId,
          plan: userData.plan,
          reason: 'user email or subscriptionId already exist',
        });
        // eslint-disable-next-line no-continue
        continue;
      }
      const plan = await this.planService.findPlanBymercadoPagoPlanId(
        userData.plan,
      );
      if (!plan) {
        failed.push({
          email: userData.email,
          subscriptionId: userData.subscriptionId,
          plan: userData.plan,
          reason: 'doesnt exist a plan with that planId',
        });
        // eslint-disable-next-line no-continue
        continue;
      }
      const planId = plan._id.toHexString();
      try {
        const statusFilter = this.mapMercadoPagoStatusToPaymentStatus(
          userData.paymentStatus,
        );
        await this.userModel.create({
          email: userData.email,
          roles: [Role.BASIC_USER],
          subscriptionId: userData.subscriptionId,
          plan: planId,
          paymentStatus: statusFilter,
          updatedStatusSubscriptionAt: new Date(),
        });
        success.push({
          email: userData.email,
        });
      } catch (error) {
        failed.push({
          email: userData.email,
          subscriptionId: userData.subscriptionId,
          reason: error.message,
        });
      }
    }
    return { success, failed };
  }

  async migratePayments(): Promise<MigratePaymentsResponseDto> {
    const payments = await this.mercadoPagoPayments.search();
    const arrayPayments = payments.results;
    const usersPaymentsImported: any[] = [];

    for (const payment of arrayPayments) {
      const paymentExist = await this.paymentsService.findPaymentByMercadoPagoId(
        payment.id,
      );

      if (!paymentExist) {
        const preApproval = await this.mercadoPagoPayments.get({
          id: payment.id,
        });
        const preApprovalAny = preApproval as any;
        const subscriptionId =
          preApprovalAny.point_of_interaction.transaction_data.subscription_id;
        const paymentStatus = preApprovalAny.status;

        if (subscriptionId && paymentStatus === 'approved') {
          const user = await this.findUserBySubscriptionId(subscriptionId);

          if (user) {
            const newPayment = await this.paymentsService.createPayment({
              externallId: payment.id,
              paymentDate: new Date(payment.date_approved),
              subscriptionId: user.subscriptionId,
              user: user._id.toString(),
              amount: payment.transaction_amount,
              plan: user.plan.toString(),
            });
            usersPaymentsImported.push({
              user: user.email,
              payment: newPayment._id,
            });
          }
        }
      }
    }
    return { success: usersPaymentsImported };
  }
}
