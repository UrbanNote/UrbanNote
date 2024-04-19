import 'reflect-metadata';
import { container } from 'tsyringe';

import { ExpenseRepositoryMock } from './mocks/expenseRepositoryMock';
import { FileMock } from './mocks/FileMock';
import { StorageRepositoryMock } from './mocks/storageRepositoryMock';
import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { AuthorizationService } from '../src/auth/authorizationService';
import { ApplicationError } from '../src/errors';
import { ExpenseCategories } from '../src/expenses/expenseDetailsDoc';
import { IExpenseInteractor, ExpenseInteractor } from '../src/expenses/expenseInteractor';
import { EntityTypes } from '../src/storage/fileMetadata';
import { StorageService } from '../src/storage/storageService';
import { IUserRepository } from '../src/users/userRepository';

container
  .registerSingleton<StorageRepositoryMock>('StorageRepository', StorageRepositoryMock)
  .registerSingleton<StorageService>('StorageService', StorageService)
  .registerSingleton<AuthorizationService>('AuthorizationService', AuthorizationService)
  .registerSingleton<ExpenseRepositoryMock>('ExpenseRepository', ExpenseRepositoryMock)
  .registerSingleton<IUserRepository>('UserRepository', UserRepositoryMock)
  .registerSingleton<IExpenseInteractor>('ExpenseInteractor', ExpenseInteractor);

describe('Storage', () => {
  const storageService = container.resolve<StorageService>('StorageService');
  const userRepository = container.resolve<IUserRepository>('UserRepository');
  const expenseInteractor = container.resolve<IExpenseInteractor>('ExpenseInteractor');
  const expenseRepository = container.resolve<ExpenseRepositoryMock>('ExpenseRepository');
  const storageRepository = container.resolve<StorageRepositoryMock>('StorageRepository');

  // creation de role
  userRepository.createUserRoles('user1', 'user1', false, true, false, false); // expenseManagement
  userRepository.createUserRoles('user2', 'user2', false, false, false, false); // user

  // creation de depense avec fichier
  expenseInteractor.createExpense('user2', 'user2', 'journal', '2024/02/02', 30, ExpenseCategories.TRAVEL, ['URL1']);
  expenseInteractor.createExpense('user2', 'user2', 'cafe', '2024/02/02', 200, ExpenseCategories.PARKING, ['URL3']);
  expenseInteractor.createExpense('user1', 'user1', 'beigne', '2024/02/02', 32, ExpenseCategories.RESTAURANT, ['URL4']);
  expenseInteractor.createExpense('user1', 'user1', 'muffin', '2024/02/02', 3, ExpenseCategories.RESTAURANT, ['URL5']);
  expenseInteractor.createExpense('user2', 'user2', 'biscuit', '2024/02/02', 2, ExpenseCategories.RESTAURANT, ['URL6']);

  // upload file
  storageRepository.uploadFile('test/URL1', new FileMock('URL1'));
  storageRepository.uploadFile('test/URL2', new FileMock('URL2'));
  storageRepository.uploadFile('test/URL3', new FileMock('URL3'));
  storageRepository.uploadFile('test/URL4', new FileMock('URL4'));
  storageRepository.uploadFile('test/URL5', new FileMock('URL5'));
  storageRepository.uploadFile('test/URL6', new FileMock('URL6'));

  /** ********************************** */
  /* test association de fichier         */
  /** ********************************** */

  it('associate file to entity', async () => {
    const expense = await expenseRepository.getExpenseDetailsById('user2');

    const path = 'test/URL1';
    const entityType: EntityTypes = EntityTypes.EXPENSE;
    const entityId = expense?.assignedToId;
    await storageService.associateFileToEntity(path, entityType, entityId!);
  });

  it('throw an error: file not found', async () => {
    const path = 'testFileNotFound';
    const entityType: EntityTypes = EntityTypes.EXPENSE;
    const entityId = 'user2';
    await expect(storageService.associateFileToEntity(path, entityType, entityId)).rejects.toThrow(ApplicationError);
  });

  /** ********************************** */
  /* test de suppression de fichier       */
  /** ********************************** */
  // suppression avec un requesterId
  it('delete file with an requesterId', async () => {
    const path = 'test/URL1';
    await storageService.deleteFile([path], 'user2');
  });

  // suppression  avec un requesterId undefined
  it('delete file with an undefined requesterId', async () => {
    const path = 'test/URL2';
    await storageService.deleteFile([path]);
  });

  // suppression d'un fichier non trouvé
  it('throw an error: file not found', async () => {
    const path = 'test/FileNotFound';
    await expect(storageService.deleteFile([path], 'user2')).rejects.toThrow(ApplicationError);
  });

  // suppression avec un user avec le role expenseManagement
  it('delete file by a user with the expenseManagement role', async () => {
    const path = 'test/URL3';
    const metadata = {
      entityType: EntityTypes.EXPENSE,
      entityId: 'user2',
      userId: 'user2',
    };

    await storageRepository.setMetadata(path, metadata);
    await storageService.deleteFile([path], 'user1');
  });

  // suppression avec un user sans le role
  it('throw an error: user without role tries to delete a file', async () => {
    const path = 'test/URL4';
    const metadata = {
      entityType: EntityTypes.EXPENSE,
      entityId: 'user1',
      userId: 'user1',
    };

    await storageRepository.setMetadata(path, metadata);
    await expect(storageService.deleteFile([path], 'user2')).rejects.toThrow(ApplicationError);
  });

  // suppression  le requesterId own pas le fichier et le fichier n'est pas associé à une depense
  it('throw an error : the requesterId does not own the file and the file is not associated with an expense', async () => {
    const path = 'test/URL4';
    const metadata = {
      entityType: EntityTypes.EXPENSE,
      entityId: '',
      userId: 'user2',
    };

    await storageRepository.setMetadata(path, metadata);
    await expect(storageService.deleteFile([path], 'user1')).rejects.toThrow(ApplicationError);
  });

  // suppression  ou le requesterId own le fichier et le fichier n'est pas relie a un ID de depense
  it('delete file where the requesterId owns the file and the file is not associated with an expense ID', async () => {
    const path = 'test/URL4';
    const metadata = {
      entityType: EntityTypes.EXPENSE,
      entityId: '',
      userId: 'user1',
    };

    await storageRepository.setMetadata(path, metadata);
    await storageService.deleteFile([path], 'user1');
  });

  // suppression  ou le requesterId own le fichier et le fichier n'a pas de type d'entité
  it('delete file where the requesterId owns the file and the file does not have an entity type', async () => {
    const path = 'test/URL5';
    const metadata = {
      entityType: '',
      entityId: 'user1',
      userId: 'user1',
    };

    await storageRepository.setMetadata(path, metadata);
    await storageService.deleteFile([path], 'user1');
  });
});
