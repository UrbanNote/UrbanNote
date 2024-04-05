import 'reflect-metadata';
import { container } from 'tsyringe';

import { ExpenseRepositoryMock } from './mocks/expenseRepositoryMock';
import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { IAuthorizationService, AuthorizationService } from '../src/auth/authorizationService';
import { ApplicationError } from '../src/errors';
import { ExpenseCategories, ExpenseStatus } from '../src/expenses/expenseDetailsDoc';
import { IExpenseInteractor, ExpenseInteractor } from '../src/expenses/expenseInteractor';
import { IExpenseRepository } from '../src/expenses/expenseRepository';
import { IUserRepository } from '../src/users/userRepository';

// TODO: test expenseObserver
// TODO: ajuster les tests. En ce moment, les titres disent ce qu'on fait, pas le comportement qu'on veut valider. Par exemple, Expenses -> have all the required fields when created, pas besoin de créer 3 tests pour 3 entrées différentes qui donnent le même résultat.

container
  .registerSingleton<IExpenseRepository>('ExpenseRepository', ExpenseRepositoryMock)
  .registerSingleton<IAuthorizationService>('AuthorizationService', AuthorizationService)
  .registerSingleton<IExpenseInteractor>('ExpenseInteractor', ExpenseInteractor)
  .registerSingleton<IUserRepository>('UserRepository', UserRepositoryMock);

describe('Expenses', () => {
  const expenseInteractor = container.resolve<IExpenseInteractor>('ExpenseInteractor');
  const expenseRepository = container.resolve<IExpenseRepository>('ExpenseRepository');
  const userRepository = container.resolve<IUserRepository>('UserRepository');

  // creation de role
  userRepository.createUserRoles('user0', 'user0', false, false, false, false); // user
  userRepository.createUserRoles('user1', 'user1', true, true, false, false); // admin et expenseManagement
  userRepository.createUserRoles('user2', 'user2', false, true, false, false); // expenseManagement
  userRepository.createUserRoles('user3', 'user3', false, false, false, false); // user
  userRepository.createUserRoles('user4', 'user4', false, false, false, false); // user

  /** ********************************** */
  /* Test de création de dépenses        */
  /** ********************************** */

  // Test de création d'une dépense avec des images et une description
  it('expense created', async () => {
    const input = {
      requesterId: 'user3',
      assignedToId: 'user3',
      title: 'cafe',
      date: '2024/02/01',
      amount: 1.3,
      pictureURL: ['url1', 'url2'],
      description: 'cafe noir',
      category: ExpenseCategories.CONVENIENCE,
    };

    await expenseInteractor.createExpense(
      input.requesterId,
      input.assignedToId,
      input.title,
      input.date,
      input.amount,
      input.category,
      input.pictureURL,
      input.description,
    );
  });

  // Test de création d'une dépense avec un montant négatif
  it('throw an error: user tries to create an expense with a negative amount', async () => {
    const input = {
      requesterId: 'user3',
      assignedToId: 'user3',
      title: 'cafe',
      date: '2024/02/01',
      amount: -10,
      pictureURL: ['url1', 'url2'],
      description: 'cafe noir',
      category: ExpenseCategories.CONVENIENCE,
    };

    await expect(
      expenseInteractor.createExpense(
        input.requesterId,
        input.assignedToId,
        input.title,
        input.date,
        input.amount,
        input.category,
        input.pictureURL,
        input.description,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'une dépense par un utilisateur expenseManagement
  it('expense created by another user with a role', async () => {
    const input = {
      requesterId: 'user2',
      assignedToId: 'user3',
      title: 'riz',
      date: '2024/01/22',
      amount: 3.5,
      category: ExpenseCategories.GROCERY,
    };

    await expenseInteractor.createExpense(
      input.requesterId,
      input.assignedToId,
      input.title,
      input.date,
      input.amount,
      input.category,
    );
  });

  // Test de création d'une dépense par un utilisateur avec aucun role
  it('throw an error: user without a role tries to create an expense', async () => {
    const input = {
      requesterId: 'user4',
      assignedToId: 'user3',
      title: 'riz',
      date: '2024/01/18',
      amount: 3.5,
      category: ExpenseCategories.GROCERY,
    };
    await expect(
      expenseInteractor.createExpense(
        input.requesterId,
        input.assignedToId,
        input.title,
        input.date,
        input.amount,
        input.category,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  // Test de création d'une dépense avec une date supérieure à la date actuelle
  it('throw an error: user tries to create an expense with a date greater than the current date', async () => {
    const input = {
      requesterId: 'user2',
      assignedToId: 'user3',
      title: 'riz',
      date: '2160/01/18',
      amount: 3.5,
      category: ExpenseCategories.GROCERY,
    };
    await expect(
      expenseInteractor.createExpense(
        input.requesterId,
        input.assignedToId,
        input.title,
        input.date,
        input.amount,
        input.category,
      ),
    ).rejects.toThrow(ApplicationError);
  });

  /** ********************************** */
  /* Test de modification de dépense     */
  /** ********************************** */

  // Création de dépenses pour tester la modification
  expenseInteractor.createExpense('user2', 'user2', 'journal', '2024/02/02', 30, ExpenseCategories.TRAVEL);
  expenseInteractor.createExpense('user2', 'user2', 'cafe', '2024/02/23', 15, ExpenseCategories.TRAVEL);
  expenseInteractor.createExpense('user2', 'user3', 'journal', '2024/02/02', 30, ExpenseCategories.TRAVEL);
  expenseInteractor.createExpense('user2', 'user4', 'nourriture', '2023/01/01', 100, ExpenseCategories.TRAVEL, [
    'url1',
    'url2',
  ]);

  // Test de modification d'une dépense par un utilisateur avec le role expenseManagement
  it('expense modification successful', async () => {
    const input = {
      requesterId: 'user2',
      expenseId: 'user2',
      updates: {
        assignedToId: 'user3',
        description: 'pour vendre',
      },
    };

    await expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates);
  });

  // Test de modification d'une dépense avec une date supérieure a 1 an de la date actuelle
  it('throw an error: user tries to update an expense with a date greater than 1 year from the current date', async () => {
    const input = {
      requesterId: 'user2',
      expenseId: 'user4',
      updates: {
        title: 'mitaines',
        description: 'pour les mains',
      },
    };
    await expect(expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates)).rejects.toThrow(
      ApplicationError,
    );
  });

  // Test de modification d'une dépense par un utilisateur avec aucun role
  it('throw an error: user without a role tries to update an expense', async () => {
    const input = {
      requesterId: 'user4',
      expenseId: 'user4',
      updates: {
        assignedToId: 'user3',
        description: 'pour vendre',
      },
    };

    await expect(expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates)).rejects.toThrow(
      ApplicationError,
    );
  });

  // Test de modification d'une dépense qui n'existe pas
  it('throw an error: user tries to update an expense that doesnt exist', async () => {
    const input = {
      requesterId: 'user2',
      expenseId: 'expenseIdNotExisting',
      updates: {
        assignedToId: 'user3',
        description: 'pour vendre',
      },
    };

    await expect(expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates)).rejects.toThrow(
      ApplicationError,
    );
  });

  /** ********************************** */
  /* Test de suppression de dépense      */
  /** ********************************** */

  // Test de suppression d'une dépense réussie
  it('expense deleted', async () => {
    const expenseId = 'user4';
    await expenseInteractor.deleteExpense('user2', expenseId);
  });

  // Test de suppression d'une dépense qui n'existe pas
  it('throw an error: user tries to delete an expense that doesnt exist', async () => {
    const expenseId = 'expenseIdToDeleteNotExisting';
    await expect(expenseInteractor.deleteExpense('user4', expenseId)).rejects.toThrow(ApplicationError);
  });

  // Test de suppression d'une dépense par un utilisateur avec aucun role
  it('throw an error: user with no role tries to delete an expense', async () => {
    const expenseId = 'user2';
    await expect(expenseInteractor.deleteExpense('user0', expenseId)).rejects.toThrow(ApplicationError);
  });

  /** ******************************************* */
  /* Test de suppression de toutes les dépenses   */
  /** ******************************************* */

  // Test de suppression de toutes les dépenses d'un utilisateur avec role
  it('all expenses deleted', async () => {
    const assignedToId = 'user3';
    await expenseInteractor.deleteAllExpenses('user2', assignedToId);
  });

  // Test de suppression de toutes les dépenses d'un utilisateur sans role
  it('throw an error: user without a role tries to delete all expenses', async () => {
    const assignedToId = 'user3';
    await expect(expenseInteractor.deleteAllExpenses('user4', assignedToId)).rejects.toThrow(ApplicationError);
  });

  // Test de suppression de toutes les dépenses d'un utilisateur qui n'existe pas ('')
  it('throw an error: user tries to delete all expenses for a user that doesnt exist ("")', async () => {
    const assignedToId = '';
    await expect(expenseInteractor.deleteAllExpenses('user2', assignedToId)).rejects.toThrow(ApplicationError);
  });

  describe('when updating status', () => {
    it('status is updated', async () => {
      await expenseInteractor.createExpense(
        'user1',
        'user1',
        'title',
        '2024/02/01',
        1.3,
        ExpenseCategories.CONVENIENCE,
        ['url1', 'url2'],
        'description',
      );

      await expenseInteractor.updateExpenseStatus('user1', 'user1', ExpenseStatus.APPROVED);
      const expense = await expenseRepository.getExpenseDetailsById('user1');

      expect(expense?.status).toBe(ExpenseStatus.APPROVED);
    });

    it('expense must exist', async () => {
      await expect(
        expenseInteractor.updateExpenseStatus(
          'user1',
          'wfhasgnmsao^gmpfisngoiadngpmpdspgmaspomfspaomd',
          ExpenseStatus.APPROVED,
        ),
      ).rejects.toThrow(ApplicationError);
    });

    it('requires the status to be new', async () => {
      await expenseInteractor.createExpense(
        'user1',
        'user1',
        'title',
        '2024/02/01',
        1.3,
        ExpenseCategories.CONVENIENCE,
        ['url1', 'url2'],
        'description',
      );

      await expenseInteractor.updateExpenseStatus('user1', 'user1', ExpenseStatus.APPROVED);
      await expect(expenseInteractor.updateExpenseStatus('user1', 'user1', ExpenseStatus.APPROVED)).rejects.toThrow(
        ApplicationError,
      );
    });

    it('requires the expenseManagement role', async () => {
      await expenseInteractor.createExpense(
        'user2',
        'user2',
        'title',
        '2024/02/01',
        1.3,
        ExpenseCategories.CONVENIENCE,
        ['url1', 'url2'],
        'description',
      );

      await expect(expenseInteractor.updateExpenseStatus('user3', 'user2', ExpenseStatus.APPROVED)).rejects.toThrow(
        ApplicationError,
      );
    });
  });
});
