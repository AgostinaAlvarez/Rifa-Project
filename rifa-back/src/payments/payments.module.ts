import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PaymentsService } from './payments.service';
import { Payments } from './payments.model';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypegooseModule.forFeature([Payments])],
  providers: [PaymentsService],
  exports: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
