import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { MailtrapModule } from './mailtrap/mailtrap.module';
import { EmailProvider } from './emails.provider';

@Module({
  controllers: [EmailsController],
  imports: [SendgridModule, MailtrapModule],
  providers: [EmailProvider],
  exports: [EmailProvider],
})
export class EmailsModule {}
