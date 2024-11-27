import { Test, TestingModule } from '@nestjs/testing';
import { BCRYPT } from './bcrypt.const';
import { Bcrypt, BcryptProvider } from './bcrypt.provider';

describe('BcryptProvider', () => {
  let bcryptProvider: Bcrypt;

  beforeEach(async () => {
    const bcryptModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [BcryptProvider],
    }).compile();

    bcryptProvider = bcryptModule.get<Bcrypt>(BCRYPT);
  });

  it('should be defined', () => {
    expect(bcryptProvider).toBeDefined();
  });
});
