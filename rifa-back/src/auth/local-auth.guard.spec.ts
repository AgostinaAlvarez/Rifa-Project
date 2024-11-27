import { GUARDS_METADATA } from '@nestjs/common/constants';

import { Controller, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

describe('Local Auth guard', () => {
  @Controller()
  @UseGuards(LocalAuthGuard)
  class Test {}

  @Controller()
  class TestWithMethod {
    @UseGuards(LocalAuthGuard)
    public test() {
      return true;
    }
  }

  @Controller()
  class TestWithStaticMethod {
    @UseGuards(LocalAuthGuard)
    public static test() {
      return true;
    }
  }

  it('should be using the guard defined on the class', () => {
    const classMetadata = Reflect.getMetadata(GUARDS_METADATA, Test);
    expect(classMetadata).toEqual([LocalAuthGuard]);
  });

  it('should be using the guard defined on the prototype method', () => {
    const instance = new TestWithMethod();

    const classMetadata = Reflect.getMetadata(GUARDS_METADATA, TestWithMethod);
    const methodMetadata = Reflect.getMetadata(GUARDS_METADATA, instance.test);
    const instanceMetadata = Reflect.getMetadata(GUARDS_METADATA, instance);

    expect(classMetadata).toBeUndefined();
    expect(methodMetadata).toEqual([LocalAuthGuard]);
    expect(instanceMetadata).toBeUndefined();
  });

  it('should be using the guard defined on the static method', () => {
    const classMetadata = Reflect.getMetadata(
      GUARDS_METADATA,
      TestWithStaticMethod,
    );
    const methodMetadata = Reflect.getMetadata(
      GUARDS_METADATA,
      TestWithStaticMethod.test,
    );

    expect(classMetadata).toBeUndefined();
    expect(methodMetadata).toEqual([LocalAuthGuard]);
  });
});
