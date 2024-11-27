// import { HttpTracingModule } from '@narando/nest-xray';
import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaptchasService } from './captchas.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('MS_TIMEOUT'),
        baseURL: configService.get('GOOGLE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CaptchasService],
  exports: [CaptchasService],
})
export class CaptchasModule {}
