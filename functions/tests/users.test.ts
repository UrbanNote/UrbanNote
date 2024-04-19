import 'reflect-metadata';
import { container } from 'tsyringe';

import { AuthRepositoryMock } from './mocks/authRepositoryMock';
import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { AuthInteractor, IAuthInteractor } from '../src/auth/authInteractor';
import { IAuthorizationService, AuthorizationService } from '../src/auth/authorizationService';
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

describe('Users', () => {
  const userInteractor = container.resolve<IUserInteractor>('UserInteractor');
  const userRepository = container.resolve<IUserRepository>('UserRepository');

  // Création de role
  userRepository.createUserRoles('user0', 'user0', true, true, true, true); // all roles
  userRepository.createUserRoles('user1', 'user1', true, false, false, true); // admin et userManagement
  userRepository.createUserRoles('user2', 'user2', false, false, false, true); // userManagement
  userRepository.createUserRoles('user3', 'user3', false, false, false, false); // user
  userRepository.createUserRoles('user4', 'user4', false, false, false, false); // user
  userRepository.createUserRoles('user5', 'user5', true, false, false, false); // admin
  userRepository.createUserRoles('user6', 'user6', false, true, false, false); // expenseManagement
  userRepository.createUserRoles('user7', 'user7', false, false, true, false); // resourceManagement

  /** *********************************** */
  /* Tests de création d'utilisateurs      */
  /** *********************************** */

  // Test de création d'un utilisateur avec un prénom choisi et des roles
  it('user created succesfully', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user30',
      email: 'jane.doe.test@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'fr',
      chosenName: 'jany',
      pictureId: 'pictureId1',
    };
    const input2 = {
      requesterId: 'user1',
      userId: 'user30',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
      input1.chosenName,
      input1.pictureId,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création avec même adresse courriel
  it('throw an error: email should be unique', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user31',
      email: 'jane.doe.unique@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user1',
      userId: 'user67',
      email: 'jane.doe.unique@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
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

  // Test de création avec userRoles déjà existant
  it('throw an error: userRoles alreadyExists', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user0',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

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

  // Test de création avec même id utilisateur
  it('throw an error: user id should be unique', async () => {
    const input1 = {
      requesterId: 'user1',
      userId: 'user77',
      email: 'jane.doe.id.unique@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user1',
      userId: 'user77',
      email: 'jane.doe.id@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
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

  // Test de création d'un utilisateur avec tous les roles par un utilisateur avec un role admin
  it('user with admin role creates a user with all roles', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user8',
      email: 'jane.doe.roles@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user8',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role admin
  it('user with admin role creates a user with admin role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user12',
      email: 'jane.doe.admin.admin@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user12',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur expenseManagement par un utilisateur avec un role admin
  it('user with admin role creates a user with expenseManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user13',
      email: 'jane.doe.expense.admin@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user13',
      admin: false,
      expenseManagement: true,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur resourceManagement par un utilisateur avec un role admin
  it('user with admin role creates a user with resourceManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user14',
      email: 'jane.doe.resource.admin@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user14',
      admin: false,
      expenseManagement: false,
      resourceManagement: true,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur userManagement par un utilisateur avec un role admin
  it('user with admin role creates a user with userManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user15',
      email: 'jane.doe.user.admin@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user15',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: true,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur expenseManagement par un utilisateur avec un role userManagement
  it('user with userManagement role creates a user with expenseManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user20',
      email: 'jane.doe.expense@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user20',
      admin: false,
      expenseManagement: true,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur resourceManagement par un utilisateur avec un role userManagement
  it('user with userManagement role creates a user with resourceManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user21',
      email: 'jane.doe.resource@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user21',
      admin: false,
      expenseManagement: false,
      resourceManagement: true,
      userManagement: false,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur userManagement par un utilisateur avec un role userManagement
  it('user with userManagement role creates a user with userManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user22',
      email: 'jane.doe.user@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user22',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: true,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur avec tous les roles sauf admin par un utilisateur avec un role userManagement
  it('user with userManagement role creates a user with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user11',
      email: 'jane.doe.notadmin@email.com',
      firstName: 'Jane',
      lastName: 'Doe',
      language: 'en',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user11',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.createUserProfile(
      input1.requesterId,
      input1.userId,
      input1.email,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.createUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role userManagement
  it('throw an error: user with userManagement role tries to create a user with admin role', async () => {
    const input2 = {
      requesterId: 'user2',
      userId: 'user90',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles par un utilisateur avec un role userManagement
  it('throw an error: user with userManagement role tries to create a user with all roles', async () => {
    const input2 = {
      requesterId: 'user2',
      userId: 'user91',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role expenseManagement
  it('throw an error: user with expenseManagement role tries to create a user with admin role', async () => {
    const input2 = {
      requesterId: 'user6',
      userId: 'user92',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles par un utilisateur avec un role expenseManagement
  it('throw an error: user with expenseManagement role tries to create a user with all roles', async () => {
    const input2 = {
      requesterId: 'user6',
      userId: 'user93',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles sauf admin par un utilisateur avec un role expenseManagement
  it('throw an error: user with expenseManagement role tries to create a user with all roles except admin', async () => {
    const input2 = {
      requesterId: 'user6',
      userId: 'user94',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur admin par un utilisateur avec un role resourceManagement
  it('throw an error: user with resourceManagement role tries to create a user with admin role', async () => {
    const input2 = {
      requesterId: 'user7',
      userId: 'user95',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles par un utilisateur avec un role resourceManagement
  it('throw an error: user with resourceManagement role tries to create a user with all roles', async () => {
    const input2 = {
      requesterId: 'user7',
      userId: 'user96',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'un utilisateur avec tous les roles sauf admin par un utilisateur avec un role resourceManagement
  it('throw an error: user with resourceManagement role tries to create a user with all roles except admin', async () => {
    const input2 = {
      requesterId: 'user7',
      userId: 'user97',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.createUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests de modification d'utilisateurs */
  /** *********************************** */

  // Création d'utilisateurs pour tester la modification
  userInteractor.createUserProfile('user1', 'user1', 'jane.doe@email.com', 'Jane', 'Doe', 'fr', 'jany', 'pictureId1');
  userInteractor.createUserProfile('user2', 'user2', 'test.test@test.ca', 'Test', 'Deux', 'en', 'deux', 'pictureId2');
  userInteractor.createUserProfile('user3', 'user3', 'john.doe@email.com', 'John', 'Doe', 'fr', 'johny', 'pictureId3');
  userInteractor.createUserProfile('user4', 'user4', 'test@test.ca', 'Test', 'Quatre', 'en', 'four', 'pictureId4');

  // Test de modification d'un utilisateur
  it('user modification successful', async () => {
    const input = {
      requesterId: 'user1',
      userId: 'user3',
      firstName: 'User',
      lastName: 'One',
      language: 'en',
      chosenName: 'one',
    };

    const input2 = {
      requesterId: 'user1',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input.requesterId,
      input.userId,
      input.firstName,
      input.lastName,
      input.language,
      input.chosenName,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test de modification d'un userProfile qui n'existe pas
  it('throw an error: user tries to update a userProfile that doesnt exist', async () => {
    const input = {
      requesterId: 'user1',
      userId: 'userProfileNotExisting',
      firstName: 'User',
      lastName: 'One',
      language: 'en',
      chosenName: 'one',
    };

    await expect(
      userInteractor.updateUserProfile(
        input.requesterId,
        input.userId,
        input.firstName,
        input.lastName,
        input.language,
        input.chosenName,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de modification d'un userRoles qui n'existe pas
  it('throw an error: user tries to update a userRoles that doesnt exist', async () => {
    const input = {
      requesterId: 'user1',
      userId: 'userRolesNotExisting',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.updateUserRoles(
        input.requesterId,
        input.userId,
        input.admin,
        input.expenseManagement,
        input.resourceManagement,
        input.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur admin qui modifie un utilisateur pour le rendre avec tous les roles
  it('user with admin role updates a user to make it with all roles', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user3',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur admin qui modifie un utilisateur pour le rendre admin
  it('user with admin role updates a user to make with admin role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user3',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur admin qui modifie un utilisateur pour le rendre expenseManagement
  it('user with admin role updates a user to make it with expenseManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur admin qui modifie un utilisateur pour le rendre resourceManagement
  it('user with admin role updates a user to make it with resourceManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user3',
      admin: false,
      expenseManagement: false,
      resourceManagement: true,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur admin qui modifie un utilisateur pour le rendre userManagement
  it('user with admin role updates a user to make it with userManagement role', async () => {
    const input1 = {
      requesterId: 'user5',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user5',
      userId: 'user3',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre avec tous les roles
  it('throw an error: user with userManagement role tries to update a user to make it with all roles', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: true,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre admin
  it('throw an error: user with userManagement role tries to update a user to make it with admin role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre expenseManagement
  it('user with userManagement role updates a user to make it with expenseManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: false,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre resourceManagement
  it('user with userManagement role updates a user to make it with resourceManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: false,
      expenseManagement: false,
      resourceManagement: true,
      userManagement: false,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre userManagement
  it('user with userManagement role updates a user to make it with userManagement role', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: false,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur userManagement qui modifie un utilisateur pour le rendre tous les roles sauf admin
  it('user with userManagement role updates a user to make it with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user2',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await userInteractor.updateUserProfile(
      input1.requesterId,
      input1.userId,
      input1.firstName,
      input1.lastName,
      input1.language,
    );

    await userInteractor.updateUserRoles(
      input2.requesterId,
      input2.userId,
      input2.admin,
      input2.expenseManagement,
      input2.resourceManagement,
      input2.userManagement,
    );
  });

  // Test d'un utilisateur expenseManagement qui modifie un utilisateur pour le rendre admin
  it('throw an error: user with expenseManagement role tries to update a user to make it with admin role', async () => {
    const input1 = {
      requesterId: 'user6',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user6',
      userId: 'user3',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await expect(
      userInteractor.updateUserProfile(
        input1.requesterId,
        input1.userId,
        input1.firstName,
        input1.lastName,
        input1.language,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur expenseManagement qui modifie un utilisateur pour le rendre tous les roles sauf admin
  it('throw an error: user with expenseManagement role tries to update a user to make it with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user6',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user6',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.updateUserProfile(
        input1.requesterId,
        input1.userId,
        input1.firstName,
        input1.lastName,
        input1.language,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur resourceManagement qui modifie un utilisateur pour le rendre admin
  it('throw an error: user with resourceManagement role tries to update a user to make it with admin role', async () => {
    const input1 = {
      requesterId: 'user7',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user7',
      userId: 'user3',
      admin: true,
      expenseManagement: false,
      resourceManagement: false,
      userManagement: false,
    };

    await expect(
      userInteractor.updateUserProfile(
        input1.requesterId,
        input1.userId,
        input1.firstName,
        input1.lastName,
        input1.language,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur resourceManagement qui modifie un utilisateur pour le rendre tous les roles sauf admin
  it('throw an error: user with resourceManagement role tries to update a user to make it with all roles except admin', async () => {
    const input1 = {
      requesterId: 'user7',
      userId: 'user3',
      firstName: 'User',
      lastName: 'Three',
      language: 'fr',
    };

    const input2 = {
      requesterId: 'user7',
      userId: 'user3',
      admin: false,
      expenseManagement: true,
      resourceManagement: true,
      userManagement: true,
    };

    await expect(
      userInteractor.updateUserProfile(
        input1.requesterId,
        input1.userId,
        input1.firstName,
        input1.lastName,
        input1.language,
      ),
    ).rejects.toThrow(ApplicationError);

    await expect(
      userInteractor.updateUserRoles(
        input2.requesterId,
        input2.userId,
        input2.admin,
        input2.expenseManagement,
        input2.resourceManagement,
        input2.userManagement,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test d'un utilisateur userManagement qui modifie le profil d'un utilisateur admin
  it('throw an error: user with userManagement role tries to update the userProfile of an admin user', async () => {
    const input1 = {
      requesterId: 'user2',
      userId: 'user5',
      firstName: 'Name',
      lastName: 'Modified',
      language: 'fr',
    };

    await expect(
      userInteractor.updateUserProfile(
        input1.requesterId,
        input1.userId,
        input1.firstName,
        input1.lastName,
        input1.language,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  /** *********************************** */
  /* Tests d'obtention d'utilisateurs     */
  /** *********************************** */

  // Test d'obtention du userProfile d'un utilisateur
  it('user gets the userProfile of a user', async () => {
    await userInteractor.getUserProfile('user4');
  });

  // Test d'obtention du userRoles d'un utilisateur
  it('user gets the userRoles of a user', async () => {
    await userInteractor.getUserRoles('user4');
  });
});
