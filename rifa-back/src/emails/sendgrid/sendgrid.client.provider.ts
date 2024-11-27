import { ConfigService } from '@nestjs/config';
import { Client } from '@sendgrid/client';
import { SENDGRID_CLIENT } from './sendgrid.constants';

export const SendgridClientProvider = {
  provide: SENDGRID_CLIENT,
  useFactory: (configService: ConfigService): Client => {
    const client = new Client();
    client.setApiKey(configService.get('SENDGRID_API_KEY'));

    return client;
  },
  inject: [ConfigService],
};
