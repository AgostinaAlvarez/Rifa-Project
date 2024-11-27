import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import { UploadUrlDto } from './dto/uploadUrl.dto';
import { UploadUrlResponseDto } from './dto/uploadUrlResponse.dto';
import { BUCKET_PROVIDER } from '../bucket/bucket.constants';

@Injectable()
export class FilesService {
  constructor(
    @Inject(BUCKET_PROVIDER) private bucketProvider: AWS.S3,
    private configService: ConfigService,
  ) {}

  private getExtension(name: string): string {
    try {
      return name.split('.').pop();
    } catch (e) {
      return '';
    }
  }

  public async uploadUrl({
    name,
    folder,
  }: UploadUrlDto): Promise<UploadUrlResponseDto> {
    const BUCKET = this.configService.get('AWS_BUCKET');
    const URL_LIFETIME = 120;

    const ext = this.getExtension(name);

    const allowedExtensions = /(jpe?g|jfif|exif|spiff|jpe|mjpeg|png|pdf|csv|p12|doc|docx)$/i;

    if (!allowedExtensions.test(ext)) {
      throw new BadRequestException('Bad extension');
    }

    const key = folder ? `${folder}/${uuid()}.${ext}` : `${uuid()}.${ext}`;

    const url = this.bucketProvider.getSignedUrl('putObject', {
      Bucket: BUCKET,
      Key: key,
      Expires: URL_LIFETIME,
      ACL: 'public-read',
    });

    return {
      url,
      publicUrl: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    };
  }
}
