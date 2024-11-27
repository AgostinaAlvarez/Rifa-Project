import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Payments } from './payments.model';
import { CreatePaymentRequestDto } from './dto/createPaymentRequest.dto';
import { FindPaymentsUserResponseDto } from './dto/findPaymentsUserResponse.dto';
import { UserInterface } from '../utils/interface/user.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments)
    private readonly paymentsModel: ReturnModelType<typeof Payments>,
  ) {}

  async createPayment(data: CreatePaymentRequestDto): Promise<Payments> {
    return this.paymentsModel.create(data);
  }

  async findPaymentByMercadoPagoId(
    externallId: string,
  ): Promise<Payments | null> {
    return this.paymentsModel.findOne({ externallId });
  }

  async getPaymentsByUserId(
    user: UserInterface,
  ): Promise<FindPaymentsUserResponseDto[]> {
    const userId = user._id.toString();
    const paymentsDocs = await this.paymentsModel.find({
      user: userId,
    });
    const payments = paymentsDocs.map(
      (doc) => doc.toObject() as FindPaymentsUserResponseDto,
    );
    return payments;
  }
}
