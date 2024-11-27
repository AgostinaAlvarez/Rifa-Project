import { Logger } from '@nestjs/common';

global.beforeAll(() => {
  jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
  jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
});
