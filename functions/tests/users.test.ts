import 'reflect-metadata';
import { container } from 'tsyringe';

import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { IAuthorizationService, AuthorizationService } from '../src/auth/authorizationService';
import { ApplicationError } from '../src/errors';
import { IUserInteractor, UserInteractor } from '../src/users/userInteractor';
import { IUserRepository } from '../src/users/userRepository';

container
  .registerSingleton<IUserRepository>('UserRepository', UserRepositoryMock)
  .registerSingleton<IAuthorizationService>('AuthorizationService', AuthorizationService)
  .registerSingleton<IUserInteractor>('UserInteractor', UserInteractor);

describe('Email addresses', () => {
  const userInteractor = container.resolve<IUserInteractor>('UserInteractor');

  it('should be unique', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user1',
      email: 'jane.doe@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en-ca',
    };

    const input2 = {
      requesterId: 'user1',
      userId: 'user2',
      email: 'jane.doe@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en-ca',
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    expect(
      userInteractor.createUserProfile(
        input2.requesterId,
        input2.userId,
        input2.email,
        input2.firstName,
        input2.lastName,
        input2.language,
      ),
    ).rejects.toThrow(ApplicationError);
  });
});
