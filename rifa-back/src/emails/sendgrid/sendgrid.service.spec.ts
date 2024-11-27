import { Test } from '@nestjs/testing';
import { MailService } from '@sendgrid/mail';
import { Client } from '@sendgrid/client';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SENDGRID_CLIENT, SENDGRID_MAIL } from './sendgrid.constants';
import { SendgridService } from './sendgrid.service';
import { EmailsDto } from '../dto/emails.dto';

const mailData: EmailsDto = {
  to: ['test@example.com'],
  from: 'test@example.com',
  subject: 'Welcome to example',
  templateId: '1232131232',
};

describe('SendGrid Service', () => {
  let sendgridService: SendgridService;
  let mailService: MailService;
  let clientService: Client;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        SendgridService,
        {
          provide: SENDGRID_MAIL,
          useValue: {
            setApiKey: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: SENDGRID_CLIENT,
          useValue: {
            setApiKey: jest.fn(),
            request: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    sendgridService = app.get<SendgridService>(SendgridService);
    mailService = app.get<MailService>(SENDGRID_MAIL);
    clientService = app.get<Client>(SENDGRID_CLIENT);
  });

  it('should be defined', () => {
    expect(sendgridService).toBeDefined();
    expect(mailService).toBeDefined();
    expect(clientService).toBeDefined();
  });

  describe('send', () => {
    it('return Promise void', async () => {
      expect.assertions(1);

      const response = await sendgridService.send(mailData);
      expect(response).toBeUndefined();
    });

    it('return Promise void', async () => {
      expect.assertions(1);

      const response = await sendgridService.send(mailData);
      expect(response).toBeUndefined();
    });

    it('should send email full ', async () => {
      expect.assertions(2);

      const response = await sendgridService.send({
        ...mailData,
        bcc: ['test@example.com'],
        cc: ['test@example.com'],
      });
      expect(response).toBeUndefined();
      expect(mailService.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('request', () => {
    it('return Promise string', async () => {
      expect.assertions(1);

      await sendgridService.getTemplate('d-084f6df31920448da38d0c15f800bbf5');

      expect(clientService.request).toHaveBeenCalledTimes(1);
    });
  });
});
