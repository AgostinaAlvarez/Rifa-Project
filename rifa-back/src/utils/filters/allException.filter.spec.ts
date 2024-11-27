import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerModule, getLoggerToken } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './allException.filter';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest
    .fn()
    .mockImplementation(() => ({ request: 'test', method: 'get' })),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

const mockConfig = {
  get: jest.fn(),
};

const ERROR_HTTP = {
  code: HttpStatus.BAD_REQUEST,
  status: 'HTTP.STATUS_FAIL',
  message: 'Bad request',
};

describe('Validate exception filter', () => {
  let service: AllExceptionsFilter;
  let config: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRootAsync({
          useFactory: async () => {
            return {
              pinoHttp: {
                name: process.env.npm_package_name,
                level: 'silent',
                prettyPrint: false,
              },
            };
          },
        }),
      ],
      controllers: [AppController],
      providers: [
        AllExceptionsFilter,
        AppService,
        {
          provide: getLoggerToken('test'),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = app.get<AllExceptionsFilter>(AllExceptionsFilter);
    config = app.get<ConfigService>(ConfigService);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Unknown server exception without array', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'production');

      service.catch(new Error(), mockArgumentsHost);

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'Internal server error: ',
            code: 500,
            details: null,
          },
        }),
      );
    });

    it('Http exception with status', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'test');

      service.catch(
        new HttpException({ ...ERROR_HTTP }, ERROR_HTTP.code),
        mockArgumentsHost,
      );

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'Bad request',
            code: 400,
            status: ERROR_HTTP.status,
            details: expect.any(Array),
          },
        }),
      );
    });

    it('Http exception without message', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'test');

      service.catch(new HttpException({}, ERROR_HTTP.code), mockArgumentsHost);

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'Http Exception',
            code: 400,
            details: expect.any(Array),
          },
        }),
      );
    });

    it('Http exception with message in response ', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'test');

      service.catch(
        new HttpException({ message: 'test' }, ERROR_HTTP.code),
        mockArgumentsHost,
      );

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'test',
            code: 400,
            details: expect.any(Array),
          },
        }),
      );
    });

    it('Internal server exception', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'test');

      service.catch(new InternalServerErrorException(), mockArgumentsHost);

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'Internal server error: Internal Server Error',
            code: 500,
            details: expect.any(Array),
          },
        }),
      );
    });

    it('Unknown server exception', () => {
      jest.spyOn(config, 'get').mockImplementation(() => 'test');

      service.catch(new Error(), mockArgumentsHost);

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(
        expect.objectContaining({
          error: {
            message: 'Internal server error: ',
            code: 500,
            details: expect.any(Array),
          },
        }),
      );
    });
  });
});
