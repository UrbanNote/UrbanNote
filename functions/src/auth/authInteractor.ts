import { UserRecord } from 'firebase-admin/auth';
import { UserProfileDoc } from 'src/users';
import { UserRolesDoc } from 'src/users/userRolesDoc';
import { inject, injectable } from 'tsyringe';

import { IAuthorizationService } from './authorizationService';
import { IAuthRepository } from './authRepository';
import { AuthUserDetails } from './authUserDetails';
import { UserDetails } from './userDetails';
import { UserWithName } from './userWithName';
import { ApplicationError } from '../errors';
import { IUserRepository } from '../users/userRepository';

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
   * @param displayName
   * @param admin
   * @param emailVerified
   * @returns A promise that resolves to the created `UserRecord` when the user has been created.
   * @throws If the requester does not have permission to create a user or if the email is already used by another user.
   */
  createAuthUser(
    requesterId: string,
    email: string,
    displayName: string,
    disabled: boolean,
    admin: boolean,
    emailVerified?: boolean,
  ): Promise<UserRecord>;

  /**
   * Updates an Auth user in the Auth provider.
   * * The requester must have `admin` or `userManagement` role.
   * @param requesterId
   * @param disabled
   * @param email
   * @param displayName
   * @param emailVerified
   * @returns A promise that resolves when the user has been updated.
   * @throws If the requester does not have permission to update a user or if it does not exist.
   */
  updateAuthUser(
    requesterId: string,
    disabled: boolean,
    email?: string,
    displayName?: string,
    emailVerified?: boolean,
  ): Promise<void>;

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
   * Gets a list of users and their names.
   * @returns A promise that resolves to a list of users and their names.
   */
  getUserNames(): Promise<UserWithName[]>;

  /**
   * Gets a list of auth users and their details.
   * @param requesterId
   * @param ipp Items per page.
   * @param pageToken The next page token. If not specified, returns users starting without any offset.
   * @param disabledFilter The disabled filter result. If not specified, return all users.
   * @param searchBarFilter The search bar filter. If not specified, return all users.
   * @returns A promise that resolves to a tuple containing the list of auth users and the next page token.
   * @throws If the requester does not have permission to get users.
   */
  getAuthUsers(
    requesterId: string,
    ipp: number,
    pageToken?: string,
    disabledFilter?: boolean,
    searchBarFilter?: string,
  ): Promise<[AuthUserDetails[], string | undefined]>;

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

  public async createAuthUser(
    requesterId: string,
    email: string,
    displayName: string,
    disabled: boolean,
    admin: boolean,
    emailVerified?: boolean,
  ) {
    await this.authorizationService.assertUserHasUserManagementRole(requesterId);

    // If the requester is not admin, he can't create an auth user admin
    const requesterRoles = await this.userRepository.getUserRoles(requesterId);
    if (!requesterRoles?.admin && admin) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }

    const existingUser = await this.authRepository.getAuthUserByEmail(email);
    if (existingUser) {
      throw new ApplicationError('already-exists', 'UserAlreadyExists');
    }

    return this.authRepository.createAuthUser(requesterId, email, displayName, disabled, emailVerified);
  }

  public async updateAuthUser(
    requesterId: string,
    disabled: boolean,
    email: string,
    displayName: string,
    emailVerified: boolean,
  ) {
    const user = await this.authRepository.getAuthUserByEmail(email);
    if (!user) {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
    if (requesterId !== user.uid) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    // If the requester is not admin, he can't update an auth user admin
    const requesterRoles = await this.userRepository.getUserRoles(requesterId);
    const userRoles = await this.userRepository.getUserRoles(user.uid);
    if (!requesterRoles?.admin && userRoles?.admin) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }

    await this.authRepository.updateAuthUser(user.uid, {
      disabled,
      displayName,
      emailVerified,
    });
  }

  public async disableUser(requesterId: string, id: string) {
    const user = await this.authRepository.getAuthUserById(id);
    if (!user) {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
    if (requesterId !== user.uid) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    // If the requester is not admin, he can't disable an auth user admin
    const requesterRoles = await this.userRepository.getUserRoles(requesterId);
    const userRoles = await this.userRepository.getUserRoles(id);
    if (!requesterRoles?.admin && userRoles?.admin) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
    }

    if (user.disabled) {
      throw new ApplicationError('invalid-argument', 'UserAlreadyDisabled');
    }

    await this.authRepository.updateAuthUser(id, { disabled: true });
  }

  public async enableUser(requesterId: string, id: string) {
    const user = await this.authRepository.getAuthUserById(id);
    if (!user) {
      throw new ApplicationError('not-found', 'UserNotFound');
    }
    if (requesterId !== user.uid) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    // If the requester is not admin, he can't enable an auth user admin
    const requesterRoles = await this.userRepository.getUserRoles(requesterId);
    const userRoles = await this.userRepository.getUserRoles(id);
    if (!requesterRoles?.admin && userRoles?.admin) {
      throw new ApplicationError('permission-denied', 'permissionDenied');
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
    await this.authorizationService.assertUserHasUserManagementRole(requesterId);

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

  public async getUserNames(): Promise<UserWithName[]> {
    const listUsersResult = await this.authRepository.getAuthUsers(1000);

    return listUsersResult.users
      .filter(user => Boolean(user.displayName))
      .map(user => ({ id: user.uid, name: user.displayName! }));
  }

  public async getAuthUsers(
    requesterId: string,
    ipp: number,
    pageToken?: string,
    disabledFilter?: boolean,
    searchBarFilter?: string,
  ): Promise<[AuthUserDetails[], string | undefined]> {
    await this.authorizationService.assertUserHasUserManagementRole(requesterId);

    const listUsersResult = await this.authRepository.getAuthUsers(ipp, pageToken);

    const userDetails = await Promise.all(
      listUsersResult.users.map(async ({ uid, disabled, email, emailVerified, displayName }) => {
        return { uid, disabled, email, emailVerified, displayName };
      }),
    );

    // Filtrer les utilisateurs selon la search bar
    if (disabledFilter == undefined && searchBarFilter) {
      return [
        userDetails.filter(
          user =>
            user.email?.includes(searchBarFilter) ||
            user.displayName
              ?.toLowerCase() // Met le displayName en LowerCase
              .normalize('NFD') // Décompose les caractères avec accent
              .replace(/[\u0300-\u036f\-\s]/g, '') // Remplace les accents, les tirets et les espaces par un string vide
              .includes(searchBarFilter), // Filtre les displayName qui contiennent la string venant de la search bar
        ),
        listUsersResult.pageToken,
      ];

      // Filtrer les utilisateurs selon leur Statuts
    } else if (disabledFilter != undefined && !searchBarFilter) {
      return [userDetails.filter(user => user.disabled === disabledFilter), listUsersResult.pageToken];

      // Filtrer les utilisateurs selon leur Statuts et la search bar
    } else if (disabledFilter != undefined && searchBarFilter) {
      return [
        userDetails.filter(
          user =>
            (user.email?.includes(searchBarFilter) ||
              user.displayName
                ?.toLowerCase() // Met le displayName en LowerCase
                .normalize('NFD') // Décompose les caractères avec accent
                .replace(/[\u0300-\u036f\-\s]/g, '') // Remplace les accents, les tirets et les espaces par un string vide
                .includes(searchBarFilter)) && // Filtre les displayName qui contiennent la string venant de la search bar
            user.disabled == disabledFilter,
        ),
        listUsersResult.pageToken,
      ];
    }

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
