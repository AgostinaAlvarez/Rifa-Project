import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}
@Injectable()
export class ResponseWrapperInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp();
    const ignorePath =
      request.getRequest().url.includes('/template/dispatches') &&
      request.getRequest().method === 'GET';

    return next.handle().pipe(
      map((data = null) => {
        if (ignorePath) {
          return data;
        }
        return { data };
      }),
    );
  }
}
