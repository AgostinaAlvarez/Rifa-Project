import { Module } from '@nestjs/common';
import {
  MercadoPagoPreApprovalProvider,
  MercadoPagoPaymentsProvider,
} from './mercado-pago.provider';

@Module({
  providers: [MercadoPagoPreApprovalProvider, MercadoPagoPaymentsProvider],
  exports: [MercadoPagoPreApprovalProvider, MercadoPagoPaymentsProvider],
})
export class MercadoPagoModule {}
