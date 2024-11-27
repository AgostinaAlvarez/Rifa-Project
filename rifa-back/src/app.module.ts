import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppImports } from './app.imports';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcript.module';
import { EmailsModule } from './emails/emails.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { FilesModule } from './files/files.module';
import { BucketModule } from './bucket/bucket.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ...AppImports,
    HealthModule,
    EmailsModule,
    BcryptModule,
    AuthModule,
    UsersModule,
    PlansModule,
    MercadoPagoModule,
    BucketModule,
    FilesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
