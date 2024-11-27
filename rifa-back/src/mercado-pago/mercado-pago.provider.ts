/* eslint-disable @typescript-eslint/no-var-requires */
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, PreApproval, Payment } from 'mercadopago';
import {
  MERCADO_PAGO_PAYMENTS_PROVIDER,
  MERCADO_PAGO_PREAPPROVAL_PROVIDER,
} from './mercado-pago.constants';

export const MercadoPagoPreApprovalProvider = {
  provide: MERCADO_PAGO_PREAPPROVAL_PROVIDER,
  useFactory: (configService: ConfigService): PreApproval => {
    const client = new MercadoPagoConfig({
      accessToken: configService.get('MERCADO_PAGO_ACCESS_TOKEN'),
    });

    return new PreApproval(client);
  },
  inject: [ConfigService],
};

export const MercadoPagoPaymentsProvider = {
  provide: MERCADO_PAGO_PAYMENTS_PROVIDER,
  useFactory: (configService: ConfigService): Payment => {
    const client = new MercadoPagoConfig({
      accessToken: configService.get('MERCADO_PAGO_ACCESS_TOKEN'),
    });

    return new Payment(client);
  },
  inject: [ConfigService],
};
