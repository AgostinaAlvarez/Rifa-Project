import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { BUCKET_PROVIDER } from '../bucket/bucket.constants';

describe('FilesService', () => {
  let filesService: FilesService;
  let configService: ConfigService;

  beforeEach(async () => {
    const filesModule: TestingModule = await Test.createTestingModule({
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

    filesService = filesModule.get<FilesService>(FilesService);
    configService = filesModule.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('function uploadUrl', () => {
    it('uploadUrl', async () => {
      const data = {
        name: 'image.png',
      };

      const response = await filesService.uploadUrl(data);
      expect(response.publicUrl).toBeDefined();
    });
  });
});
