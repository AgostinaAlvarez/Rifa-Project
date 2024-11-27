import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import * as httpMock from 'node-mocks-http';
import { of } from 'rxjs';

import { TimestampInterceptor } from './timestamp.interceptor';

const interceptor = new TimestampInterceptor();

const mock = {
  email: 'test@test.com',
};
const next = {
  handle: jest.fn(() => of(mock)),
};

describe('Validate TimestampInterceptor interceptor', () => {
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('must have a header called x-timestamp-ms', async () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    await interceptor
      .intercept(new ExecutionContextHost([req, res]), next)
      .toPromise();

    expect(res.getHeader('x-timestamp-ms')).toBeDefined();
  });
});
