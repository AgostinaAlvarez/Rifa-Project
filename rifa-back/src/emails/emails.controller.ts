import {
  Body,
  Controller,
  HttpStatus,
  HttpCode,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EmailsDto } from './dto/emails.dto';
import { EMAIL_PROVIDER } from './constants/emailProviders.constant';
import { Emails } from './interfaces/emails.interface';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { EmailsResponseDto } from './dto/emailsResponse.dto';
import { ErrorResponseDto } from '../utils/dto/error.dto';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  constructor(@Inject(EMAIL_PROVIDER) private emailProvider: Emails) {}

  @ApiOperation({
    summary: 'Send emails',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: apiResponseWrapper(EmailsResponseDto),
    description: 'Accepted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @HttpCode(202)
  @Post()
  async createEmail(@Body() data: EmailsDto): Promise<void> {
    await this.emailProvider.send(data);
  }
}
