import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import * as httpMock from 'node-mocks-http';
import { of } from 'rxjs';

import { ResponseWrapperInterceptor } from './responseWrapper.interceptor';

const interceptor = new ResponseWrapperInterceptor();

describe('Validate ResponseWrapperInterceptor interceptor', () => {
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('must be an object with a data wrap', async () => {
    const mock = {
      email: 'test@test.com',
    };
    const next = {
      handle: jest.fn(() => of(mock)),
    };

    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    const { data } = await interceptor
      .intercept(new ExecutionContextHost([req, res]), next)
      .toPromise();

    expect(data).toEqual(mock);
  });

  it('must be a null with a data wrap', async () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    const mock = undefined;

    const next = {
      handle: jest.fn(() => of(mock)),
    };

    const { data } = await interceptor
      .intercept(new ExecutionContextHost([req, res]), next)
      .toPromise();

    expect(data).toEqual(null);
  });
});
