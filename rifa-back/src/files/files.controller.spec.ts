import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { BUCKET_PROVIDER } from '../bucket/bucket.constants';

describe('FilesController', () => {
  let configService: ConfigService;
  let filesService: FilesService;
  let filesController: FilesController;

  beforeEach(async () => {
    const filesModule: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        FilesService,
        {
          provide: BUCKET_PROVIDER,
          useValue: {
            getSignedUrl: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'x'),
          },
        },
      ],
    }).compile();

    configService = filesModule.get<ConfigService>(ConfigService);
    filesService = filesModule.get<FilesService>(FilesService);
    filesController = filesModule.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
    expect(filesService).toBeDefined();
    expect(filesController).toBeDefined();
  });

  describe('function uploadUrl', () => {
    it('uploadUrl', async () => {
      const data = {
        name: 'image.png',
      };

      const spy = jest.spyOn(filesService, 'uploadUrl');

      await filesController.uploadUrl(data);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
