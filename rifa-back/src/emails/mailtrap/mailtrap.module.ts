import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailtrapService } from './mailtrap.service';
import { SendgridModule } from '../sendgrid/sendgrid.module';

@Module({
  providers: [MailtrapService],
  exports: [MailtrapService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAILTRAP_HOST'),
          port: config.get('MAILTRAP_PORT'),
          auth: {
            user: config.get('MAILTRAP_USER'),
            pass: config.get('MAILTRAP_PASS'),
          },
        },
      }),
    }),
    SendgridModule,
  ],
})
export class MailtrapModule {}
