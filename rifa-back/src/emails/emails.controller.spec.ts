import { Test, TestingModule } from '@nestjs/testing';
import { EmailsDto } from './dto/emails.dto';
import { EmailsController } from './emails.controller';
import { EmailProvider } from './emails.provider';

describe('EmailsController', () => {
  let controller: EmailsController;
  const mailData: EmailsDto = {
    to: ['test@example.com'],
    from: 'test@example.com',
    subject: 'Welcome to example',
    templateId: '123123123123',
  };

  describe('Call mailstrap', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [EmailsController],
        providers: [
          EmailProvider,
          {
            provide: 'EMAIL_PROVIDER',
            useValue: {
              EMAIL_PROVIDER: 'mailstrap',
              send: jest.fn(),
            },
          },
        ],
      }).compile();

      controller = module.get<EmailsController>(EmailsController);
    });
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('Receiv data', async () => {
      const response = await controller.createEmail(mailData);
      expect(response).toBeUndefined();
    });
  });

  describe('Call sendgrid', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [EmailsController],
        providers: [
          EmailProvider,
          {
            provide: 'EMAIL_PROVIDER',
            useValue: {
              EMAIL_PROVIDER: 'sendgrid',
              send: jest.fn(),
            },
          },
        ],
      }).compile();

      controller = module.get<EmailsController>(EmailsController);
    });
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('Receiv data', async () => {
      const response = await controller.createEmail(mailData);
      expect(response).toBeUndefined();
    });
  });
});
