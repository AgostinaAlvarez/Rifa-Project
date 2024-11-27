import { Injectable, Inject } from '@nestjs/common';
import { Client } from '@sendgrid/client';
import { ClientRequest } from '@sendgrid/client/src/request';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { EmailsDto } from '../dto/emails.dto';
import { Emails } from '../interfaces/emails.interface';
import { SENDGRID_CLIENT, SENDGRID_MAIL } from './sendgrid.constants';

@Injectable()
export class SendgridService implements Emails {
  constructor(
    @Inject(SENDGRID_MAIL) private sendgridProvider: MailService,
    @Inject(SENDGRID_CLIENT) private sendgridClientProvider: Client,
    public configService: ConfigService,
  ) {}

  async send(data: EmailsDto): Promise<void> {
    const environment = this.configService.get<string>('NODE_ENV');

    let name;

    switch (environment) {
      case 'development':
        name = `[DEV] Equipo Rifa Club`;
        break;
      case 'staging':
        name = `[STG] Equipo Rifa Club`;
        break;
      default:
        name = `Equipo Rifa Club`;
    }

    const msg = {
      from: {
        email: data.from,
        name,
      },
      personalizations: [
        {
          to: data.to.map((to) => ({ email: to })),
          cc: data.cc?.map((cc) => ({ email: cc })),
          bcc: data.bcc?.map((bcc) => ({ email: bcc })),
          dynamic_template_data: data.extraPayload,
        },
      ],
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      template_id: data.templateId,
    };

    await this.sendgridProvider.send(msg as any);
  }

  async getTemplate(templateId: string): Promise<string> {
    try {
      const request: ClientRequest = {
        url: `/v3/templates/${templateId}`,
        method: 'GET',
      };

      const [response] = await this.sendgridClientProvider.request(request);
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const activeHtml = response.body['versions'].find(
        (version) => version.active === 1,
      ).html_content;

      return activeHtml;
    } catch (error) {
      return '';
    }
  }
}
