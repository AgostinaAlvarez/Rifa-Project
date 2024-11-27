import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './sendgrid.constants';

export const SendgridProvider = {
  provide: SENDGRID_MAIL,
  useFactory: (configService: ConfigService): MailService => {
    const sendgrid = new MailService();
    sendgrid.setApiKey(configService.get('SENDGRID_API_KEY'));
    sendgrid.setTimeout(configService.get('SENDGRID_TIMEOUT'));

    return sendgrid;
  },
  inject: [ConfigService],
};
