import { inject, injectable } from 'tsyringe';

import { ApplicationError } from '../errors';
import { IUserRepository } from '../users/userRepository';
import { UserRoles, UserRolesDoc } from '../users/userRolesDoc';

/** Authorizes actions in the Interactor layer based on user roles. */
export interface IAuthorizationService {
  /** Asserts that the user has the admin role or throws an error. */
  assertUserIsAdmin(userId: string): Promise<void>;

  /** Asserts that the user has the expense management role or throws an error. */
  assertUserHasExpenseManagementRole(userId: string): Promise<void>;

  /** Asserts that the user has the resource management role or throws an error. */
  assertUserHasResourceManagementRole(userId: string): Promise<void>;

  /** Asserts that the user has the user management role or throws an error. */
  assertUserHasUserManagementRole(userId: string): Promise<void>;

  /**
   * Asserts that the user has a specific combination or roles or throws an error.
   * @param roles An object containing the roles to assert, with `true` for the roles to assert and `false` for the roles to ignore.
   */
  assertUserHasRoles(userId: string, roles: Partial<Omit<UserRoles, 'id'>>): Promise<void>;
}

@injectable()
export class AuthorizationService implements IAuthorizationService {
  constructor(@inject('UserRepository') private readonly userRepository: IUserRepository) {}

  private async getUserRoles(userId: string): Promise<UserRolesDoc> {
    const userRoles = await this.userRepository.getUserRoles(userId);
    if (!userRoles) {
      throw new ApplicationError('not-found', 'UserRolesNotFound');
    }

    return userRoles;
  }

  public async assertUserIsAdmin(userId: string) {
    const userRoles = await this.getUserRoles(userId);
    if (!userRoles.admin) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }
  }

  public async assertUserHasExpenseManagementRole(userId: string) {
    const userRoles = await this.getUserRoles(userId);
    if (!userRoles.admin && !userRoles.expenseManagement) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }
  }

  public async assertUserHasResourceManagementRole(userId: string) {
    const userRoles = await this.getUserRoles(userId);
    if (!userRoles.admin && !userRoles.resourceManagement) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }
  }

  public async assertUserHasUserManagementRole(userId: string) {
    const userRoles = await this.getUserRoles(userId);
    if (!userRoles.admin && !userRoles.userManagement) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }
  }

  public async assertUserHasRoles(userId: string, roles: Partial<Omit<UserRoles, 'id'>>) {
    const userRoles = await this.getUserRoles(userId);
    if (userRoles.admin) return;

    if (roles.admin) await this.assertUserIsAdmin(userId);
    if (roles.expenseManagement) await this.assertUserHasExpenseManagementRole(userId);
    if (roles.resourceManagement) await this.assertUserHasResourceManagementRole(userId);
    if (roles.userManagement) await this.assertUserHasUserManagementRole(userId);
  }
}
