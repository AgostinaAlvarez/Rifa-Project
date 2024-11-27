import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypegooseModule } from 'nestjs-typegoose';
import { CaptchasModule } from '../captchas/captchas.module';
// eslint-disable-next-line import/no-cycle
import { EmailsModule } from '../emails/emails.module';
import { BcryptModule } from '../bcrypt/bcript.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
// eslint-disable-next-line import/no-cycle
import { AuthModule } from '../auth/auth.module';
import { DateHandlerProvider } from '../utils/providers/dayjs/dateHandler.provider';
import {
  MercadoPagoPaymentsProvider,
  MercadoPagoPreApprovalProvider,
} from '../mercado-pago/mercado-pago.provider';
import { Plans } from '../plans/plans.model';
// eslint-disable-next-line import/no-cycle
import { PlansModule } from '../plans/plans.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([Plans]),
    EmailsModule,
    BcryptModule,
    forwardRef(() => LoggerModule.forRoot()),
    forwardRef(() => AuthModule),
    forwardRef(() => PlansModule),
    CaptchasModule,
    PaymentsModule,
  ],
  providers: [
    UsersService,
    DateHandlerProvider,
    MercadoPagoPreApprovalProvider,
    MercadoPagoPaymentsProvider,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
