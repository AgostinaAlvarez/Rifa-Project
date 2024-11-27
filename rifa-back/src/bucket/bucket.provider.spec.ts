import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BUCKET_PROVIDER } from './bucket.constants';
import { BucketProvider } from './bucket.provider';
import S3 from 'aws-sdk/clients/s3';

describe('BucketProvider', () => {
  let bucketProvider: S3;
  let configService: ConfigService;

  beforeEach(async () => {
    const bucketModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [BucketProvider, ConfigService],
    }).compile();
    configService = bucketModule.get<ConfigService>(ConfigService);
    bucketProvider = bucketModule.get<S3>(BUCKET_PROVIDER);
  });

  it('should be defined', () => {
    expect(bucketProvider).toBeDefined();
  });
});
