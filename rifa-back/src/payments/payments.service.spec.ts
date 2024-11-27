import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payments } from './payments.model';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;

  const paymentsModel = getModelForClass(Payments, {
    schemaOptions: {
      collection: `pays-${Math.random().toString(36).substring(7)}`,
    },
  });

  const date = new Date();

  const mockPayment = {
    externallId: 'externalid',
    paymentDate: date,
    subscriptionId: 'subscriptionid',
    amount: 9900,
    user: '6695e2e11563509cbce2149e',
    plan: '6697d36d3d750b1e60cebf54',
  };

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken('Payments'),
          useValue: paymentsModel,
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(paymentsService).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const response = await paymentsService.createPayment(mockPayment);

      expect(response.amount).toEqual(9900);
      expect(response.paymentDate).toEqual(date);
      expect(response.externallId).toEqual('externalid');
      expect(response.subscriptionId).toEqual('subscriptionid');
      expect(response.user.toString()).toEqual('6695e2e11563509cbce2149e');
      expect(response.plan.toString()).toEqual('6697d36d3d750b1e60cebf54');
    });
  });
  describe('getPaymentsByUserId', () => {
    let newPayment;
    beforeEach(async () => {
      newPayment = await paymentsModel.create(mockPayment);
    });
    it('should get a payment or payments by user id', async () => {
      const response = await paymentsService.getPaymentsByUserId(
        newPayment.user,
      );
      const payment = response[0];
      expect(payment.amount).toEqual(9900);
      expect(payment.paymentDate).toEqual(date);
      expect(payment.externallId).toEqual('externalid');
      expect(payment.subscriptionId).toEqual('subscriptionid');
      expect(payment.user.toString()).toEqual('6695e2e11563509cbce2149e');
      expect(payment.plan.toString()).toEqual('6697d36d3d750b1e60cebf54');
    });
    it('should return empty array if no payments are found', async () => {
      await paymentsModel.deleteMany({ user: newPayment.user });

      expect(
        await paymentsService.getPaymentsByUserId(newPayment.user),
      ).toEqual([]);
    });
  });

  describe('findPaymentByMercadoPagoId', () => {
    beforeEach(async () => {
      await paymentsModel.create(mockPayment);
    });
    it('should create a new payment', async () => {
      const externallId = 'externalid';
      const response = await paymentsService.findPaymentByMercadoPagoId(
        externallId,
      );

      expect(response.amount).toEqual(9900);
      expect(response.paymentDate).toEqual(date);
      expect(response.externallId).toEqual('externalid');
      expect(response.subscriptionId).toEqual('subscriptionid');
      expect(response.user.toString()).toEqual('6695e2e11563509cbce2149e');
      expect(response.plan.toString()).toEqual('6697d36d3d750b1e60cebf54');
    });

    it('should return null if there is no payment with externallId', async () => {
      const externallId = 'noexternallId';
      const response = await paymentsService.findPaymentByMercadoPagoId(
        externallId,
      );

      expect(response).toBe(null);
    });
  });
});
