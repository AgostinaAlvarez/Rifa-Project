import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_CLIENT } from './sendgrid.constants';
import { SendgridClientProvider } from './sendgrid.client.provider';

describe('Sendgrid Provider Test', () => {
  let sendgridClientProvider: MailService;

  beforeEach(async () => {
    const sendgridModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        SendgridClientProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'SG.XXXXXXXXXX'),
          },
        },
      ],
    }).compile();

    sendgridClientProvider = sendgridModule.get<MailService>(SENDGRID_CLIENT);
  });

  it('should be defined', () => {
    expect(sendgridClientProvider).toBeDefined();
  });
});
