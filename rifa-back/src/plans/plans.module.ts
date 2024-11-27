import { Module, forwardRef } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypegooseModule } from 'nestjs-typegoose';
import { MercadoPagoModule } from '../mercado-pago/mercado-pago.module';
import { PlanService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plans } from './plans.model';
import { MercadoPagoPreApprovalProvider } from '../mercado-pago/mercado-pago.provider';
// eslint-disable-next-line import/no-cycle
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => LoggerModule.forRoot()),
    TypegooseModule.forFeature([Plans]),
    MercadoPagoModule,
    forwardRef(() => UsersModule),
  ],
  providers: [PlanService, MercadoPagoPreApprovalProvider],
  controllers: [PlansController],
  exports: [PlanService],
})
export class PlansModule {}
