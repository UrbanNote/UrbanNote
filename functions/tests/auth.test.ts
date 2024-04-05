import 'reflect-metadata';
import { container } from 'tsyringe';

import { AuthRepositoryMock } from './mocks/authRepositoryMock';
import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { AuthInteractor, IAuthInteractor } from '../src/auth/authInteractor';
import { AuthorizationService, IAuthorizationService } from '../src/auth/authorizationService';
import { IAuthRepository } from '../src/auth/authRepository';
import { ApplicationError } from '../src/errors';
import { IUserInteractor, UserInteractor } from '../src/users/userInteractor';
import { IUserRepository } from '../src/users/userRepository';

container
  .registerSingleton<IUserRepository>('UserRepository', UserRepositoryMock)
  .registerSingleton<IAuthorizationService>('AuthorizationService', AuthorizationService)
  .registerSingleton<IUserInteractor>('UserInteractor', UserInteractor)
  .registerSingleton<IAuthRepository>('AuthRepository', AuthRepositoryMock)
  .registerSingleton<IAuthInteractor>('AuthInteractor', AuthInteractor);

describe('Auth', () => {
  const userInteractor = container.resolve<IUserInteractor>('UserInteractor');
  const userRepository = container.resolve<IUserRepository>('UserRepository');
  const authInteractor = container.resolve<IAuthInteractor>('AuthInteractor');
  const authRepository = container.resolve<IAuthRepository>('AuthRepository');

  // Création de role
  userRepository.createUserRoles('user0', 'user0', false, false, false, true); // userManagement
  userRepository.createUserRoles('user1', 'user1', false, false, false, true); // userManagement
  userRepository.createUserRoles('user2', 'user2', false, true, false, false); // expenseManagement
  userRepository.createUserRoles('user3', 'user3', false, false, true, false); // resourceManagement
  userRepository.createUserRoles('user4', 'user4', true, false, false, false); // admin
  userRepository.createUserRoles('user5', 'user5', true, false, false, false); // admin
  userRepository.createUserRoles('user6', 'user6', true, false, false, false); // admin
  userRepository.createUserRoles('user7', 'user7', true, false, false, false); // admin
  userRepository.createUserRoles('user8', 'user8', true, false, false, false); // admin
  userRepository.createUserRoles('userAdmin', 'userAdmin', true, false, false, false); // admin
  userRepository.createUserRoles('userAdmin2', 'userAdmin2', true, false, false, false); // admin
  userRepository.createUserRoles('userManagement', 'userManagement', false, false, false, true); // userManagement
  userRepository.createUserRoles('userManagement2', 'userManagement2', false, false, false, true); // userManagement
  userRepository.createUserRoles('userNonAdmin2', 'userNonAdmin2', false, false, false, true); // userManagement
  userRepository.createUserRoles('userNonAdmin3', 'userNonAdmin3', false, false, false, true); // userManagement
  userRepository.createUserRoles('userAdmin3', 'userAdmin3', true, false, false, false); // admin

  /** *********************************** */
  /* Tests de création d'auth users       */
  /** *********************************** */

  // Test de création d'un utilisateur avec aucun role par un utilisateur avec un role userManagement
  it('user with userManagement role creates a user with no role', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user11',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    const input2 = {
      requesterId: 'user1',
      email: 'jane.doe.user.pass@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: false,
    };

    await authInteractor.createAuthUser(
      input2.requesterId,
      input2.email,
      input2.displayName,
      input2.disabled,
      input2.admin,
    );

    await userInteractor.createUserRoles(
      input1.requesterId,
      input1.userId,
      input1.admin,
      input1.expenseManagement,
      input1.resourceManagement,
      input1.userManagement,
    );
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role admin
  it('user with admin role creates a user with admin role', async () => {
    const input1 = {
      requesterId: 'user4',
      userId: 'user12',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    const input2 = {
      requesterId: 'user4',
      email: 'jane.doe.admin.pass@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    await authInteractor.createAuthUser(
      input2.requesterId,
      input2.email,
      input2.displayName,
      input2.disabled,
      input2.admin,
    );

    await userInteractor.createUserRoles(
      input1.requesterId,
      input1.userId,
      input1.admin,
      input1.expenseManagement,
      input1.resourceManagement,
      input1.userManagement,
    );
  });

  // Test de création avec même adresse courriel
  it('throw an error: email should be unique', async () => {
    const input1 = {
      requesterId: 'user4',
      email: 'jane.doe.unique.fail@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    const input2 = {
      requesterId: 'user4',
      email: 'jane.doe.unique.fail@email.com',
      displayName: 'John Doe',
      disabled: false,
      admin: true,
    };

    await authInteractor.createAuthUser(
      input1.requesterId,
      input1.email,
      input1.displayName,
      input1.disabled,
      input1.admin,
    );

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles par un utilisateur avec un role userManagement
  it('throw an error: user with userManagement role tries to create a user with all roles', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user9',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    const input2 = {
      requesterId: 'user1',
      email: 'jane.doe.user@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role userManagement
  it('throw an error: user with userManagement role tries to create a user with admin role', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user10',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    const input2 = {
      requesterId: 'user1',
      email: 'jane.doe.admin@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role expenseManagement
  it('throw an error: user with expenseManagement role tries to create a user with admin role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user50',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    const input2 = {
      requesterId: 'user2',
      email: 'jane.doe.admin.expense.error@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles sauf admin par un utilisateur avec un role expenseManagement
  it('throw an error: user with expenseManagement role tries to create a user with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user51',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    const input2 = {
      requesterId: 'user2',
      email: 'jane.doe.all.expense.error@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: false,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role resourceManagement
  it('throw an error: user with resourceManagement role tries to create a user with admin role', async () => {
    const input1 = {
      requesterId: 'user3',
      userId: 'user52',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    const input2 = {
      requesterId: 'user3',
      email: 'jane.doe.admin.resource.error@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: true,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles sauf admin par un utilisateur avec un role resourceManagement
  it('throw an error: user with resourceManagement role tries to create a user with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user3',
      userId: 'user53',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    const input2 = {
      requesterId: 'user3',
      email: 'jane.doe.all.resource.error@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: false,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.createUserRoles(
        input1.requesterId,
        input1.userId,
        input1.admin,
        input1.expenseManagement,
        input1.resourceManagement,
        input1.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur par un utilisateur qui n'a pas de userRoles
  it('throw an error: user without userRoles tries to create a user', async () => {
    const input2 = {
      requesterId: 'user200',
      email: 'jane.doe.without.userroles.error@email.com',
      displayName: 'Jane Doe',
      disabled: false,
      admin: false,
    };

    await expect(
      authInteractor.createAuthUser(
        input2.requesterId,
        input2.email,
        input2.displayName,
        input2.disabled,
        input2.admin,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests de modification d'auth users   */
  /** *********************************** */

  // Création d'utilisateurs pour tester la modification

  /** Puisque, dans le fichier authRepositoryMock.ts, le uid du nouvel utilisateur est le même que le requesterId, plusieurs utilisateurs
   *  peuvent avoir le même uid et ceci peut, par conséquent, modifier les résultats des tests consécutifs agissant sur les mêmes
   *  utilisateurs. */

  authInteractor.createAuthUser('user0', 'email.enabled@email.ca', 'Email Enabled', false, false, false); // enabled, pas admin
  authInteractor.createAuthUser('user1', 'test.test@test.ca', 'Test Deux', true, false, false); // disabled, pas admin
  authInteractor.createAuthUser('user4', 'jane.doe@email.com', 'Jane Doe', false, true, false); // enabled, admin
  authInteractor.createAuthUser('user5', 'test@test.ca', 'Test Quatre', true, true, false); // disabled, admin
  authInteractor.createAuthUser('user6', 'email.unique.disabled@email.com', 'Test Cinq', true, false, false); // disabled, pas admin
  authInteractor.createAuthUser('user7', 'admin@email.com', 'Admin Un', false, true, false); // enabled, admin
  authInteractor.createAuthUser('user8', 'admin.enabled@email.com', 'Admin Deux', false, true, false); // enabled, admin
  authInteractor.createAuthUser('userAdmin', 'user.enabled@email.com', 'Pas Admin', false, false, false); // enabled, pas admin
  authInteractor.createAuthUser('userManagement', 'user.enabled2@email.com', 'Pas Admin Deux', false, false, false); // enabled, pas admin
  authInteractor.createAuthUser('userManagement2', 'user.enabled3@email.com', 'Pas Admin Trois', false, false, false); // enabled, pas admin
  authInteractor.createAuthUser('userAdmin2', 'user.disabled@email.com', 'Admin Trois', true, true, false); // disabled, admin
  authInteractor.createAuthUser('userNonAdmin2', 'user.disabled2@email.com', 'Pas Admin Quatre', true, false, false); // disabled, pas admin
  authInteractor.createAuthUser('userNonAdmin3', 'user.disabled3@email.com', 'Pas Admin Cinq', true, false, false); // disabled, pas admin
  authInteractor.createAuthUser('userAdmin3', 'user.admin.modify@email.com', 'Admin Quatre', true, true, false); // disabled, admin

  // Test de modification d'un auth user admin par un auth user admin
  it('auth user with admin role updates an auth user with admin role', async () => {
    const input1 = {
      requesterId: 'user4',
      disabled: true,
      email: 'user.admin.modify@email.com',
      displayName: 'Name Modified',
      emailVerified: false,
    };

    await authInteractor.updateAuthUser(
      input1.requesterId,
      input1.disabled,
      input1.email,
      input1.displayName,
      input1.emailVerified,
    );
  });

  // Test de modification d'un auth user non admin par un auth user admin
  it('auth user with admin role updates an auth user without admin role', async () => {
    const input1 = {
      requesterId: 'user4',
      disabled: true,
      email: 'test.test@test.ca',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await authInteractor.updateAuthUser(
      input1.requesterId,
      input1.disabled,
      input1.email,
      input1.displayName,
      input1.emailVerified,
    );
  });

  // Test de modification d'un auth user non admin par un auth user userManagement
  it('auth user with userManagement role updates an auth user without admin role', async () => {
    const input1 = {
      requesterId: 'user1',
      disabled: true,
      email: 'test.test@test.ca',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await authInteractor.updateAuthUser(
      input1.requesterId,
      input1.disabled,
      input1.email,
      input1.displayName,
      input1.emailVerified,
    );
  });

  // Test de modification d'un auth user admin par un auth user userManagement
  it('throw an error: auth user with userManagement role tries to update an auth user with admin role', async () => {
    const input1 = {
      requesterId: 'user1',
      disabled: true,
      email: 'user.admin.modify@email.com',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un auth user admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to update an auth user with admin role', async () => {
    const input1 = {
      requesterId: 'user2',
      disabled: true,
      email: 'user.admin.modify@email.com',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un auth user non admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to update an auth user without admin role', async () => {
    const input1 = {
      requesterId: 'user2',
      disabled: true,
      email: 'test.test@test.ca',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un auth user non admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to update an auth user without admin role', async () => {
    const input1 = {
      requesterId: 'user3',
      disabled: true,
      email: 'test.test@test.ca',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un auth user admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to update an auth user with admin role', async () => {
    const input1 = {
      requesterId: 'user3',
      disabled: true,
      email: 'user.admin.modify@email.com',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un auth user qui n'existe pas
  it('throw an error: auth user updates fail (user not found)', async () => {
    const input1 = {
      requesterId: 'user4',
      disabled: true,
      email: 'test.test.doesnt.exist@test.ca',
      displayName: 'Jany Doe',
      emailVerified: true,
    };

    await expect(
      authInteractor.updateAuthUser(
        input1.requesterId,
        input1.disabled,
        input1.email,
        input1.displayName,
        input1.emailVerified,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests de désactivation d'auth users  */
  /** *********************************** */

  // Test de désactivation d'un auth user admin par un auth user admin
  it('auth user with admin role disables an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('admin.enabled@email.com');

    if (user) {
      await authInteractor.disableUser('user4', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user non admin par un auth user admin
  it('auth user with admin role disables an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled@email.com');

    if (user) {
      await authInteractor.disableUser('user4', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user non admin par un auth user userManagement
  it('auth user with userManagement role disables an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled2@email.com');

    if (user) {
      await authInteractor.disableUser('user1', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user admin par un auth user userManagement
  it('throw an error: auth user with userManagement role tries to disable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user1', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to disable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user2', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user non admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to disable an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled3@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user2', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to disable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user3', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user non admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to disable an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled3@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user3', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test de désactivation d'un auth user déjà désactivé
  it('throw an error: an admin auth user tries to disable a user already disabled', async () => {
    const user = await authRepository.getAuthUserByEmail('email.unique.disabled@email.com');

    if (user) {
      await expect(authInteractor.disableUser('user4', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // // Test de désactivation d'un auth user qui n'existe pas
  it('throw an error: auth user disable fail (user not found)', async () => {
    await expect(authInteractor.disableUser('user1', 'idNotExisting')).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests d'activation d'auth users      */
  /** *********************************** */

  // Test d'activation d'un auth user admin par un auth user admin
  it('auth user with admin role enables an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.disabled@email.com');

    if (user) {
      await authInteractor.enableUser('user4', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user non admin par un auth user admin
  it('auth user with admin role enables an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.disabled2@email.com');

    if (user) {
      await authInteractor.enableUser('user4', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user non admin par un auth user userManagement
  it('auth user with userManagement role enables an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.disabled3@email.com');

    if (user) {
      await authInteractor.enableUser('user1', user?.uid);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user admin par un auth user userManagement
  it('throw an error: auth user with userManagement role tries to enable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.enableUser('user1', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to enable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.enableUser('user2', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user non admin par un auth user expenseManagement
  it('throw an error: auth user with expenseManagement role tries to enable an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled3@email.com');

    if (user) {
      await expect(authInteractor.enableUser('user2', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to enable an auth user with admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('jane.doe@email.com');

    if (user) {
      await expect(authInteractor.enableUser('user3', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user non admin par un auth user resourceManagement
  it('throw an error: auth user with resourceManagement role tries to enable an auth user without admin role', async () => {
    const user = await authRepository.getAuthUserByEmail('user.enabled3@email.com');

    if (user) {
      await expect(authInteractor.enableUser('user3', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user déjà activé
  it('throw an error: a userManagement user tries to enable a user already enabled', async () => {
    const user = await authRepository.getAuthUserByEmail('email.enabled@email.ca');

    if (user) {
      await expect(authInteractor.enableUser('user1', user?.uid)).rejects.toThrow(ApplicationError);
    } else {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
  });

  // Test d'activation d'un auth user qui n'existe pas
  it('throw an error: auth user enable fail (user not found)', async () => {
    await expect(authInteractor.enableUser('user1', 'idNotExisting')).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests d'obtention des users          */
  /** *********************************** */

  // Test d'obtention des users par un utilisateur admin
  it('auth user with admin role gets the users', async () => {
    await authInteractor.getUsers('user4', 10);
  });

  // Test d'obtention des users par un utilisateur userManagement
  it('auth user with userManagement role gets the users', async () => {
    await authInteractor.getUsers('user1', 10);
  });

  // Test d'obtention des users par un utilisateur expenseManagement
  it('throw an error: auth user with expenseManagement role gets the users', async () => {
    await expect(authInteractor.getUsers('user2', 10)).rejects.toThrow(ApplicationError);
  });

  // Test d'obtention des users par un utilisateur resourceManagement
  it('throw an error: auth user with resourceManagement role gets the users', async () => {
    await expect(authInteractor.getUsers('user3', 10)).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests d'obtention des auth users     */
  /** *********************************** */

  // Test d'obtention des auth users par un utilisateur admin
  it('auth user with admin role gets the auth users', async () => {
    await authInteractor.getAuthUsers('user4', 10);
  });

  // Test d'obtention des auth users par un utilisateur userManagement
  it('auth user with userManagement role gets the auth users', async () => {
    await authInteractor.getAuthUsers('user1', 10);
  });

  // Test d'obtention des auth users par un utilisateur expenseManagement
  it('throw an error: auth user with expenseManagement role gets the auth users', async () => {
    await expect(authInteractor.getAuthUsers('user2', 10)).rejects.toThrow(ApplicationError);
  });

  // Test d'obtention des auth users par un utilisateur resourceManagement
  it('throw an error: auth user with resourceManagement role gets the auth users', async () => {
    await expect(authInteractor.getAuthUsers('user3', 10)).rejects.toThrow(ApplicationError);
  });

  // Test d'obtention des auth users qui sont disabled
  it('auth user gets the disabled auth users', async () => {
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, true);

    for (const user of users[0]) {
      if (!user.disabled) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users qui sont enabled
  it('auth user gets the enabled auth users', async () => {
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, false);

    for (const user of users[0]) {
      if (user.disabled) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users avec un filtre sur la barre de recherche (filtre sur le email)
  it('auth user gets the auth users filtered by a search bar (filter on email)', async () => {
    const filter = '.ca';
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, undefined, filter);

    for (const user of users[0]) {
      if (
        !user.email?.includes(filter) &&
        !user.displayName
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f\-\s]/g, '')
          ?.includes(filter)
      ) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users avec un filtre sur la barre de recherche (filtre sur le displayName)
  it('auth user gets the auth users filtered by a search bar (filter on displayName)', async () => {
    const filter = 'quatre';
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, undefined, filter);

    for (const user of users[0]) {
      if (
        !user.email?.includes(filter) &&
        !user.displayName
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f\-\s]/g, '')
          ?.includes(filter)
      ) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users avec un filtre sur la barre de recherche (filtre sur le email && displayName)
  it('auth user gets the auth users filtered by a search bar (filter on email && displayName)', async () => {
    const filter = 'email';
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, undefined, filter);

    for (const user of users[0]) {
      if (
        !user.email?.includes(filter) &&
        !user.displayName
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f\-\s]/g, '')
          ?.includes(filter)
      ) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users avec un filtre sur le statut (disabled) et sur la barre de recherche
  it('auth user gets the auth users filtered by status (disabled) and a search bar', async () => {
    const filter = '.ca';
    const users = await authInteractor.getAuthUsers('user1', 10, undefined, true, filter);

    for (const user of users[0]) {
      if (
        !user.disabled ||
        (!user.email?.includes(filter) &&
          !user.displayName
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\-\s]/g, '')
            ?.includes(filter))
      ) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });

  // Test d'obtention des auth users avec un filtre sur le statut (enabled) et sur la barre de recherche
  it('auth user gets the auth users filtered by status (enabled) and a search bar', async () => {
    const filter = '.ca';
    const users = await authInteractor.getAuthUsers('user4', 10, undefined, false, filter);

    for (const user of users[0]) {
      if (
        user.disabled ||
        (!user.email?.includes(filter) &&
          !user.displayName
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\-\s]/g, '')
            ?.includes(filter))
      ) {
        throw new ApplicationError('invalid-argument', 'invalidArgument');
      }
    }
  });
});
