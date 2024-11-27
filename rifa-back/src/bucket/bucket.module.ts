import { Module } from '@nestjs/common';
import { BucketProvider } from './bucket.provider';

@Module({
  providers: [BucketProvider],
  exports: [BucketProvider],
})
export class BucketModule {}
