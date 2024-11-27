import { GUARDS_METADATA } from '@nestjs/common/constants';

import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from './role.guard';

describe('RolesGuard guard', () => {
  @Controller()
  @UseGuards(RolesGuard)
  class Test {}

  @Controller()
  class TestWithMethod {
    @UseGuards(RolesGuard)
    public test() {
      return true;
    }
  }

  @Controller()
  class TestWithStaticMethod {
    @UseGuards(RolesGuard)
    public static test() {
      return true;
    }
  }

  it('should be using the guard defined on the class', () => {
    const classMetadata = Reflect.getMetadata(GUARDS_METADATA, Test);
    expect(classMetadata).toEqual([RolesGuard]);
  });

  it('should be using the guard defined on the prototype method', () => {
    const instance = new TestWithMethod();

    const classMetadata = Reflect.getMetadata(GUARDS_METADATA, TestWithMethod);
    const methodMetadata = Reflect.getMetadata(GUARDS_METADATA, instance.test);
    const instanceMetadata = Reflect.getMetadata(GUARDS_METADATA, instance);

    expect(classMetadata).toBeUndefined();
    expect(methodMetadata).toEqual([RolesGuard]);
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
    expect(methodMetadata).toEqual([RolesGuard]);
  });
});
