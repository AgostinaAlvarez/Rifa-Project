import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { User } from './user.decorator';

describe('Validate user decorator', () => {
  class Test {
    public test(@User() user) {
      return user;
    }
  }

  it('should be using the data defined on the method', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createRequest();
    const mockUser = {
      id: '12345',
      roles: ['admin'],
      country: 'CL',
      email: 'test@test.com',
    };
    req.user = mockUser;
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    const user = metadata[Object.keys(metadata)[0]].factory(
      null,
      new ExecutionContextHost([req, res]),
    );
    expect(user).toEqual(mockUser);
  });

  it('should be return only user id', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const mockUser = {
      id: '12345',
      roles: ['admin'],
      country: 'CL',
      email: 'test@test.com',
    };
    req.user = mockUser;
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    const id = metadata[Object.keys(metadata)[0]].factory(
      'id',
      new ExecutionContextHost([req, res]),
    );
    expect(id).toEqual(mockUser.id);
  });
});
