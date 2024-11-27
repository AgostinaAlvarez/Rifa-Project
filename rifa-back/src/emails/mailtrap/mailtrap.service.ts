import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import * as HandlebarsFormat from 'handlebars-dateformat';
import * as HandlebarsEquals from 'handlebars-helper-equal';
import { EmailsDto } from '../dto/emails.dto';
import { Emails } from '../interfaces/emails.interface';
import { SendgridService } from '../sendgrid/sendgrid.service';

@Injectable()
export class MailtrapService implements Emails {
  constructor(
    private mailService: MailerService,
    private sendgridService: SendgridService,
    public configService: ConfigService,
  ) {}

  async send(data: EmailsDto): Promise<void> {
    const environment = this.configService.get<string>('NODE_ENV');

    let from;

    switch (environment) {
      case 'development':
        from = `[DEV] Equipo Rifa Club<${data.from}>`;
        break;
      case 'staging':
        from = `[STG] Equipo Rifa Club<${data.from}>`;
        break;
      default:
        from = `Equipo Rifa Club<${data.from}>`;
    }

    const mailOptions = {
      from, // Sender address
      to: data.to, // List of recipients
      subject: data.subject, // Subject line
      html: await this.generateHtml(data),
      cc: data.cc,
      bcc: data.bcc,
    };

    await this.mailService.sendMail(mailOptions);
  }

  async generateHtml(data: EmailsDto): Promise<string> {
    const html = await this.sendgridService.getTemplate(data.templateId);
    const code = JSON.stringify(data.extraPayload);
    if (html) {
      Handlebars.registerHelper('formatDate', HandlebarsFormat);
      Handlebars.registerHelper('equals', HandlebarsEquals);

      const template = Handlebars.compile(html);
      return `<html><body>${template(
        data.extraPayload,
      )}<br><code>${code}</code></body></html>`;
    }

    return `<html><body><code>${code}</code></body></html>`;
  }
}
