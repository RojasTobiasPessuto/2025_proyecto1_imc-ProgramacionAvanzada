import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../imc/entities/user.entity';

describe('AuthModule', () => {
  it('should be defined', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .compile();

    const module = moduleRef.get<AuthModule>(AuthModule);
    expect(module).toBeInstanceOf(AuthModule);
  });
});