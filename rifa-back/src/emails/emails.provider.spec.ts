import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailtrapService } from './mailtrap/mailtrap.service';
import { SendgridService } from './sendgrid/sendgrid.service';
import { EMAIL_PROVIDER } from './constants/emailProviders.constant';
import { Emails } from './interfaces/emails.interface';
import { EmailProvider } from './emails.provider';
import { ProvidersEnum } from './enum/providers.enum';

describe('EmailProvider mailtrap', () => {
  let emailProvider: Emails;

  beforeEach(async () => {
    const emailsModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EmailProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ProvidersEnum.MAILTRAP),
          },
        },
        {
          provide: SendgridService,
          useValue: jest.fn(),
        },
        {
          provide: MailtrapService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    emailProvider = emailsModule.get<Emails>(EMAIL_PROVIDER);
  });

  it('should be defined', () => {
    expect(emailProvider).toBeDefined();
  });
});

describe('EmailProvider sendgrind', () => {
  let emailProvider: Emails;

  beforeEach(async () => {
    const emailsModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EmailProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ProvidersEnum.SENDGRID),
          },
        },
        {
          provide: SendgridService,
          useValue: jest.fn(),
        },
        {
          provide: MailtrapService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    emailProvider = emailsModule.get<Emails>(EMAIL_PROVIDER);
  });

  it('should be defined', () => {
    expect(emailProvider).toBeDefined();
  });
});

describe('EmailProvider invalid', () => {
  it('invalid provider', async () => {
    try {
      await Test.createTestingModule({
        imports: [],
        providers: [
          EmailProvider,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'invalid'),
            },
          },
          {
            provide: SendgridService,
            useValue: jest.fn(),
          },
          {
            provide: MailtrapService,
            useValue: jest.fn(),
          },
        ],
      }).compile();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
