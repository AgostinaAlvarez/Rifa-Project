import { Test, TestingModule } from '@nestjs/testing';
import { Payment, PreApproval } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import {
  MercadoPagoPaymentsProvider,
  MercadoPagoPreApprovalProvider,
} from './mercado-pago.provider';
import {
  MERCADO_PAGO_PAYMENTS_PROVIDER,
  MERCADO_PAGO_PREAPPROVAL_PROVIDER,
} from './mercado-pago.constants';

describe('BcryptProvider', () => {
  let mercadoPaymentProvider: Payment;
  let mercadoPreApprovalProvider: PreApproval;
  let configService: ConfigService;

  beforeEach(async () => {
    const mercadoPagoProviderModule: TestingModule = await Test.createTestingModule(
      {
        imports: [],
        providers: [
          ConfigService,
          MercadoPagoPaymentsProvider,
          MercadoPagoPreApprovalProvider,
        ],
      },
    ).compile();
    configService = mercadoPagoProviderModule.get<ConfigService>(ConfigService);

    mercadoPaymentProvider = mercadoPagoProviderModule.get<Payment>(
      MERCADO_PAGO_PAYMENTS_PROVIDER,
    );
    mercadoPreApprovalProvider = mercadoPagoProviderModule.get<PreApproval>(
      MERCADO_PAGO_PREAPPROVAL_PROVIDER,
    );
  });

  it('should be defined', () => {
    expect(mercadoPaymentProvider).toBeDefined();
    expect(mercadoPreApprovalProvider).toBeDefined();
  });
});
