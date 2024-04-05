import { container as tContainer } from 'tsyringe';

import { AuthController, IAuthController } from './auth/authController';
import { AuthInteractor, IAuthInteractor } from './auth/authInteractor';
import { AuthorizationService, IAuthorizationService } from './auth/authorizationService';
import { AuthRepository, IAuthRepository } from './auth/authRepository';
import { IExpenseController, ExpenseController } from './expenses/expenseController';
import { IExpenseInteractor, ExpenseInteractor } from './expenses/expenseInteractor';
import { IExpenseObserver, ExpenseObserver } from './expenses/expenseObserver';
import { IExpenseRepository, ExpenseRepository } from './expenses/expenseRepository';
import { IStorageRepository, StorageRepository } from './storage/storageRepository';
import { IStorageService, StorageService } from './storage/storageService';
import { IUserController, UserController } from './users/userController';
import { IUserInteractor, UserInteractor } from './users/userInteractor';
import { IUserRepository, UserRepository } from './users/userRepository';

/**
 * Application's dependency injection container. Make sure to always import this container from here.
 */
const container = tContainer
  // Repositories
  .register<IAuthRepository>('AuthRepository', { useClass: AuthRepository })
  .register<IExpenseRepository>('ExpenseRepository', { useClass: ExpenseRepository })
  .register<IStorageRepository>('StorageRepository', { useClass: StorageRepository })
  .register<IUserRepository>('UserRepository', { useClass: UserRepository })
  // Services
  .register<IAuthorizationService>('AuthorizationService', { useClass: AuthorizationService })
  .register<IStorageService>('StorageService', { useClass: StorageService })
  // Interactors
  .register<IAuthInteractor>('AuthInteractor', { useClass: AuthInteractor })
  .register<IExpenseInteractor>('ExpenseInteractor', { useClass: ExpenseInteractor })
  .register<IUserInteractor>('UserInteractor', { useClass: UserInteractor })
  // Controllers
  .register<IAuthController>('AuthController', { useClass: AuthController })
  .register<IExpenseController>('ExpenseController', { useClass: ExpenseController })
  .register<IUserController>('UserController', { useClass: UserController })
  // Observers
  .register<IExpenseObserver>('ExpenseObserver', { useClass: ExpenseObserver });

export default container;
