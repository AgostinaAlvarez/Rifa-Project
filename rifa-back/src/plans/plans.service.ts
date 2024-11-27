import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { PreApproval } from 'mercadopago';
import { Plans } from './plans.model';
// eslint-disable-next-line import/no-cycle
import { UsersService } from '../users/users.service';
import { CreatePlanRequestDto } from './dto/createPlans.dto';
import { CreateResponsePlanDto } from './dto/createPlansResponse.dto';
import { MERCADO_PAGO_PREAPPROVAL_PROVIDER } from '../mercado-pago/mercado-pago.constants';
import { Frecuency } from '../utils/enums/planFrecuency.enum';
import { CreateSuscriptionRequestDto } from './dto/createSuscription.dto';
import { UserInterface } from '../utils/interface/user.interface';
import { CreateSuscriptionResponseDto } from './dto/createSuscriptionResponse.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plans)
    private readonly planModel: ReturnModelType<typeof Plans>,
    private configService: ConfigService,
    @Inject(MERCADO_PAGO_PREAPPROVAL_PROVIDER) private mercadoPago: PreApproval,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => Logger)) private readonly logger: Logger,
  ) {}

  async findAllPlans(): Promise<Plans[]> {
    return this.planModel.find();
  }

  async create(plan: CreatePlanRequestDto): Promise<CreateResponsePlanDto> {
    const newplan = await this.planModel.create(plan);
    return newplan;
  }

  async createSuscription(
    data: CreateSuscriptionRequestDto,
    user: UserInterface,
    planId: string,
  ): Promise<CreateSuscriptionResponseDto> {
    const plan = await this.findPlan(planId);
    const cardToken = data.cardTokenId;
    const url = this.configService.get<string>('HOST_RIFA_CLUB');
    const urlRedirect = `${url}/complete-profile`;
    let frecuencyType = 'months';
    let frecuencyMp = 1;
    if (plan.frecuency === Frecuency.ANUAL) {
      frecuencyMp = 365;
      frecuencyType = 'days';
    }

    const body = {
      reason: plan.name,
      payer_email: data.payerEmail,
      auto_recurring: {
        frequency: frecuencyMp,
        frequency_type: frecuencyType,
        transaction_amount: plan.price,
        currency_id: 'CLP',
      },
      back_url: urlRedirect,
      external_reference: user._id,
      card_token_id: cardToken,
      preapproval_plan_id: plan.mercadoPagoPlanId,
      status: 'authorized',
    };

    try {
      const response = await this.mercadoPago.create({ body });
      const subscriptionId = response.id;
      const paymentStatus = this.usersService.mapMercadoPagoStatusToPaymentStatus(
        response.status,
      );

      const updateSuccessful = await this.usersService.updateUserSubscription(
        paymentStatus,
        subscriptionId,
        planId,
        user._id,
      );
      if (!updateSuccessful) {
        throw new InternalServerErrorException('Failed to update subscription');
      }
      const initPoint = response.init_point;
      return { initPoint, subscriptionId };
    } catch (error) {
      this.logger.error(error);
      throw new PreconditionFailedException(
        `Payment creation failed: ${error.message || error}`,
      );
    }
  }

  async findPlan(id: string): Promise<Plans> {
    const plan = await this.planModel.findById(id);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async findPlanBymercadoPagoPlanId(mercadoPagoPlanId: string): Promise<Plans> {
    return this.planModel.findOne({ mercadoPagoPlanId });
  }
}
