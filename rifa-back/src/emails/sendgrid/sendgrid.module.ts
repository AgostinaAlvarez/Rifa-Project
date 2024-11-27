import { HttpModule, Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { SendgridProvider } from './sendgrid.provider';
import { SendgridClientProvider } from './sendgrid.client.provider';

@Module({
  imports: [HttpModule],
  providers: [SendgridService, SendgridProvider, SendgridClientProvider],
  exports: [SendgridService],
})
export class SendgridModule {}
