import { UserRecord } from 'firebase-admin/auth';
import { inject, injectable } from 'tsyringe';

import { IAuthorizationService } from './authorizationService';
import { IAuthRepository } from './authRepository';
import { UserDetails } from './userDetails';
import { ApplicationError } from '../errors';
import { UserProfileDoc } from '../users';
import { IUserRepository } from '../users/userRepository';
import { UserRolesDoc } from '../users/userRolesDoc';

/**
 * Connects the application to its authentication data source. Also provides methods for checking permissions.
 */
export interface IAuthInteractor {
  /**
   * Creates a new Auth user in the Auth provider.
   * * The requester must have `admin` or `userManagement` role.
   * * The email must not be already used by another user.
   * @param requesterId
   * @param email
   * @returns A promise that resolves to the created `UserRecord` when the user has been created.
   * @throws If the requester does not have permission to create a user or if the email is already used by another user.
   */
  createAuthUser(requesterId: string, email: string): Promise<UserRecord>;

  /**
   * Disables an Auth user in the Auth provider. A disabled user cannot sign in.
   * * The requester must have `admin` or `userManagement` role.
   * @param requesterId
   * @param id
   * @returns A promise that resolves when the user has been disabled.
   * @throws If the requester does not have permission to disable a user, if the user is already disabled or if it does not exist.
   */
  disableUser(requesterId: string, id: string): Promise<void>;

  /**
   * Enables a disabled Auth user in the Auth provider.
   * * The requester must have `admin` or `userManagement` role.
   * @param requesterId
   * @param id
   * @returns A promise that resolves when the user has been enabled.
   * @throws If the requester does not have permission to enable a user, if the user is already enabled or if it does not exist.
   */
  enableUser(requesterId: string, id: string): Promise<void>;

  /**
   * Gets a list of users and their details.
   * @param requesterId
   * @param ipp Items per page.
   * @param pageToken The next page token. If not specified, returns users starting without any offset.
   * @returns A promise that resolves to a tuple containing the list of users and the next page token.
   * @throws If the requester does not have permission to get users.
   */
  getUsers(requesterId: string, ipp: number, pageToken?: string): Promise<[UserDetails[], string | undefined]>;

  /**
   * Parses a `UserRecord` and its associated documents into a `UserDetails` object.
   * @param user
   * @param profile
   * @param roles
   * @returns A `UserDetails` object.
   */
  parseUserDetails(user: UserRecord, profile: UserProfileDoc, roles: UserRolesDoc): UserDetails;
}

@injectable()
export class AuthInteractor implements IAuthInteractor {
  constructor(
    @inject('AuthorizationService') private readonly authorizationService: IAuthorizationService,
    @inject('AuthRepository') private readonly authRepository: IAuthRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async createAuthUser(requesterId: string, email: string) {
    this.authorizationService.assertUserHasUserManagementRole(requesterId);

    const existingUser = await this.authRepository.getAuthUserByEmail(email);
    if (existingUser) {
      throw new ApplicationError('already-exists', 'UserAlreadyExists');
    }

    return this.authRepository.createAuthUser(email);
  }

  public async disableUser(requesterId: string, id: string) {
    this.authorizationService.assertUserHasUserManagementRole(requesterId);

    const user = await this.authRepository.getAuthUserById(id);
    if (!user) {
      throw new ApplicationError('not-found', 'UserNotFound');
    }

    if (user.disabled) {
      throw new ApplicationError('invalid-argument', 'UserAlreadyDisabled');
    }

    await this.authRepository.updateAuthUser(id, { disabled: true });
  }

  public async enableUser(requesterId: string, id: string) {
    this.authorizationService.assertUserHasUserManagementRole(requesterId);

    const user = await this.authRepository.getAuthUserById(id);
    if (!user) {
      throw new ApplicationError('not-found', 'UserNotFound');
    }

    if (!user.disabled) {
      throw new ApplicationError('invalid-argument', 'UserAlreadyEnabled');
    }

    await this.authRepository.updateAuthUser(id, { disabled: false });
  }

  public async getUsers(
    requesterId: string,
    ipp: number,
    pageToken?: string,
  ): Promise<[UserDetails[], string | undefined]> {
    this.authorizationService.assertUserHasUserManagementRole(requesterId);

    const listUsersResult = await this.authRepository.getAuthUsers(ipp, pageToken);

    const userDetails = await Promise.all(
      listUsersResult.users.map(async user => {
        const profile = await this.userRepository.getUserProfileById(user.uid);
        const roles = await this.userRepository.getUserRoles(user.uid);
        return this.parseUserDetails(user, profile, roles);
      }),
    );

    return [userDetails, listUsersResult.pageToken];
  }

  public parseUserDetails(user: UserRecord, profile: UserProfileDoc | null, roles: UserRolesDoc | null): UserDetails {
    const profileParsed =
      profile === null
        ? null
        : {
            firstName: profile.firstName,
            lastName: profile.lastName,
            language: profile.language,
            chosenName: profile.chosenName,
            pictureId: profile.pictureId,
          };

    const rolesParsed =
      roles === null
        ? null
        : {
            admin: roles.admin,
            expenseManagement: roles.expenseManagement,
            resourceManagement: roles.resourceManagement,
            userManagement: roles.userManagement,
          };

    return {
      id: user.uid,
      email: user.email || '',
      disabled: user.disabled,
      emailVerified: user.emailVerified,
      profile: profileParsed,
      roles: rolesParsed,
    };
  }
}
