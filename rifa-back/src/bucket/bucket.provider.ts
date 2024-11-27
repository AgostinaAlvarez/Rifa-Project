import { ConfigService } from '@nestjs/config';
import S3 from 'aws-sdk/clients/s3';
import { BUCKET_PROVIDER } from './bucket.constants';

export const BucketProvider = {
  provide: BUCKET_PROVIDER,
  useFactory: (configService: ConfigService): S3 => {
    return new S3({
      signatureVersion: 'v4',
      apiVersion: '2010-12-01',
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_ACCESS_SECRET'),
    });
  },
  inject: [ConfigService],
};
