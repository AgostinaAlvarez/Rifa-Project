import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as errorStackParser from 'error-stack-parser';
import { ErrorResponseDto } from '../dto/error.dto';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger, private config: ConfigService) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { status }: any =
      exception instanceof HttpException && exception.getResponse();

    const errorResponse: ErrorResponseDto = {
      code,
      status,
      message:
        code !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error ||
            exception.response.message ||
            exception.message
          : `Internal server error: ${exception.message}`,
      details:
        this.config.get('NODE_ENV') !== 'production'
          ? errorStackParser.parse(exception)
          : null,
    };
    this.logger.error(
      `${request.method} ${request.url}`,
      exception,
      AllExceptionsFilter.name,
    );

    response.status(code).json({ error: errorResponse });
  }
}
