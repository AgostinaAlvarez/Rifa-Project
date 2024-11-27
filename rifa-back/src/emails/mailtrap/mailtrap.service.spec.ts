import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EmailsDto } from '../dto/emails.dto';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { MailtrapService } from './mailtrap.service';

describe('MailtrapService', () => {
  let mailtrapService: MailtrapService;
  let mailerService: MailerService;
  let sengridService: SendgridService;

  beforeEach(async () => {
    const mailtrapModule: TestingModule = await Test.createTestingModule({
      providers: [
        MailtrapService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: SendgridService,
          useValue: {
            getTemplate: jest.fn(),
          },
        },
      ],
    }).compile();

    mailtrapService = mailtrapModule.get<MailtrapService>(MailtrapService);
    mailerService = mailtrapModule.get<MailerService>(MailerService);
    sengridService = mailtrapModule.get<SendgridService>(SendgridService);
  });

  it('should be defined', () => {
    expect(mailtrapService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(sengridService).toBeDefined();
  });

  describe('function send', () => {
    it('return Promise void', async () => {
      const mailData: EmailsDto = {
        from: 'test@test.com',
        to: ['test@test.com'],
        subject: 'test@test.com',
        extraPayload: { name: 'example' },
        templateId: '123456',
      };

      expect.assertions(1);

      const htmlToSend = await mailtrapService.generateHtml(mailData);
      const sendData = {
        from: mailData.from,
        to: mailData.to,
        subject: mailData.subject,
        html: htmlToSend,
        templateId: mailData.templateId,
      };

      const response = await mailtrapService.send(sendData);
      expect(response).toBeUndefined();
    });
  });

  describe('function sendMail', () => {
    it('return Promise void', async () => {
      const emailsDto: EmailsDto = {
        from: 'test@test.com',
        to: ['test@test.com'],
        subject: 'test@test.com',
        extraPayload: { name: 'example' },
        templateId: '123456',
      };

      expect.assertions(2);

      const htmlToSend = await mailtrapService.generateHtml(emailsDto);

      const sendData = {
        from: emailsDto.from,
        to: emailsDto.to,
        subject: emailsDto.subject,
        html: htmlToSend,
        notificationsId: emailsDto.templateId,
      };

      const response = await mailerService.sendMail(sendData);
      expect(response).toBeUndefined();
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('function generateHtml', () => {
    it('return html', async () => {
      const emailsDto: EmailsDto = {
        from: 'test@test.com',
        to: ['test@test.com'],
        subject: 'test@test.com',
        extraPayload: { name: 'example' },
        templateId: '123456',
      };

      expect.assertions(1);

      const htmlToSend = await mailtrapService.generateHtml(emailsDto);

      expect(htmlToSend).toBeDefined();
    });

    it('return html with sendgrid', async () => {
      const emailsDto: EmailsDto = {
        from: 'test@test.com',
        to: ['test@test.com'],
        subject: 'test@test.com',
        extraPayload: { name: 'example' },
        templateId: '123456',
      };

      expect.assertions(2);

      jest
        .spyOn(sengridService, 'getTemplate')
        .mockImplementation(() => Promise.resolve('<html>{{name}}</html>'));

      const htmlToSend = await mailtrapService.generateHtml(emailsDto);

      expect(htmlToSend).toBeDefined();
      expect(htmlToSend).toContain('example');
    });
  });
});
