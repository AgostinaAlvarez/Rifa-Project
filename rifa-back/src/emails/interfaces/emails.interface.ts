import { EmailsDto } from '../dto/emails.dto';

export interface Emails {
  send(data: EmailsDto): Promise<void>;
}
