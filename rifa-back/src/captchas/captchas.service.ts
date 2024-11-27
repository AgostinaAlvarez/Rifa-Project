import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchasService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async handleSend(token: string): Promise<void> {
    const serverKey = this.configService.get('GOOGLE_SERVER_KEY');
    const url = `/recaptcha/api/siteverify?secret=${serverKey}&response=${token}`;
    const { data } = await this.httpService.post(url).toPromise();
    if (!data.success) {
      throw new HttpException('Incorrect captcha', HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
