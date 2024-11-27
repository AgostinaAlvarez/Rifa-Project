import { ConfigService } from '@nestjs/config';
import { ProvidersEnum } from './enum/providers.enum';
import { SendgridService } from './sendgrid/sendgrid.service';
import { MailtrapService } from './mailtrap/mailtrap.service';
import { EMAIL_PROVIDER } from './constants/emailProviders.constant';
import { Emails } from './interfaces/emails.interface';

export const EmailProvider = {
  provide: EMAIL_PROVIDER,
  useFactory: (
    configService: ConfigService,
    sendgridService: SendgridService,
    mailtrapService: MailtrapService,
  ): Emails => {
    const provider = configService.get(EMAIL_PROVIDER);
    if (provider === ProvidersEnum.SENDGRID) {
      return sendgridService;
    }
    if (provider === ProvidersEnum.MAILTRAP) {
      return mailtrapService;
    }
    throw new Error('provider not found');
  },
  inject: [ConfigService, SendgridService, MailtrapService],
};

export class AppModule {}
