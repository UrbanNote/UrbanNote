import 'reflect-metadata';
import { container } from 'tsyringe';

import { ExpenseRepositoryMock } from './mocks/expenseRepositoryMock';
import { UserRepositoryMock } from './mocks/userRepositoryMock';
import { IAuthorizationService, AuthorizationService } from '../src/auth/authorizationService';
import { ApplicationError } from '../src/errors';
import { ExpenseCategories } from '../src/expenses/expenseDetailsDoc';
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
  const userRepository = container.resolve<IUserRepository>('UserRepository');

  // creation de role
  userRepository.createUserRoles('user1', 'user1', true, true, false, false); // admin et expenseManagement
  userRepository.createUserRoles('user2', 'user2', false, true, false, false); // expenseManagement
  userRepository.createUserRoles('user3', 'user3', false, false, false, false); // user
  userRepository.createUserRoles('user4', 'user4', false, false, false, false); // user
  /** ********************************** */
  /* test de création de dépenses        */
  /** ********************************** */

  // test de création de dépense avec utilisateur sans role
  it('creation de depense sans description et sans image', async () => {
    const input = {
      requesterId: 'user3',
      assignedToId: 'user3',
      title: 'cafe',
      date: '2024/01/01',
      amount: 1.3,
      category: ExpenseCategories.RESTAURANT,
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

  it('creation de depense avec description et sans image', async () => {
    const input = {
      requesterId: 'user3',
      assignedToId: 'user3',
      title: 'ficello',
      date: '2023/02/02',
      amount: 30,
      pictureURL: [''],
      description: 'pour jean pierre',
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

  it('creation de depense avec description et url', async () => {
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

  it('creation de depense avec un montant négatif', async () => {
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

  // test de création de dépense avec utilisateur avec role
  it('creation de depense avec role expenseManagement', async () => {
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

  it('creation de depense avec role expenseManagement et admin', async () => {
    const input = {
      requesterId: 'user1',
      assignedToId: 'user3',
      title: 'chcolat',
      date: '2024/02/03',
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

  it('creation de depense pour un autre  utilisateur avec un demandeur sans role', async () => {
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

  /** ********************************** */
  /* test de modification de dépense     */
  /** ********************************** */

  // creation de dépense pour tester la modification
  expenseInteractor.createExpense('user2', 'user2', 'journal', '2024/02/02', 30, ExpenseCategories.TRAVEL);
  expenseInteractor.createExpense('user3', 'user3', 'journal', '2024/02/02', 30, ExpenseCategories.TRAVEL);
  expenseInteractor.createExpense('user4', 'user4', 'nourriture', '2023/01/01', 100, ExpenseCategories.TRAVEL);

  // test de modification de dépense avec utilisateur sans role
  it('modifier une dépense normale', async () => {
    const input = {
      requesterId: 'user2',
      expenseId: 'user2',
      updates: {
        title: 'mitaines',
      },
    };

    await expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates);
  });

  it('modifier une dépense avec une date supérieur a 1 ans de la date actuel', async () => {
    const input = {
      requesterId: 'user4',
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

  // test de modification de dépense avec utilisateur avec role
  it('modifier une dépense que le demandeur a le role expenseManagement', async () => {
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

  it('modifier une dépense que le demandeur a le role expenseManagement ou admin', async () => {
    const input = {
      requesterId: 'user1',
      expenseId: 'user2',
      updates: {
        assignedToId: 'user3',
        description: 'pour vendre',
      },
    };

    await expenseInteractor.updateExpense(input.requesterId, input.expenseId, input.updates);
  });

  it('modifier une dépense que le demandeur aucun role ', async () => {
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
});
