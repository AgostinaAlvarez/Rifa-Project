import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { CaptchasService } from './captchas.service';

jest.mock('../users/users.service');

describe('CaptchasService', () => {
  let captchasService: CaptchasService;
  let httpService: HttpService;

  beforeEach(async () => {
    const captchasModule: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchasService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    httpService = captchasModule.get<HttpService>(HttpService);
    captchasService = captchasModule.get<CaptchasService>(CaptchasService);
  });

  it('should be defined', () => {
    expect(captchasService).toBeDefined();
  });

  describe('function handleSend', () => {
    it('successful captcha token', async () => {
      const axiosResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(axiosResponse));

      await captchasService.handleSend('captchaToken');
    });

    it('wrong captcha token', async () => {
      expect.assertions(1);

      const axiosResponse: AxiosResponse = {
        data: { success: false },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(axiosResponse));

      try {
        await captchasService.handleSend('captchaToken');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
