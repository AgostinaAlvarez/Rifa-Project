import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [BucketModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
