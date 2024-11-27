import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './sendgrid.constants';
import { SendgridProvider } from './sendgrid.provider';

describe('Sendgrid Provider Test', () => {
  let sendgridProvider: MailService;

  beforeEach(async () => {
    const sendgridModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        SendgridProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'SG.XXXXXXXXXX'),
          },
        },
      ],
    }).compile();

    sendgridProvider = sendgridModule.get<MailService>(SENDGRID_MAIL);
  });

  it('should be defined', () => {
    expect(sendgridProvider).toBeDefined();
  });
});
