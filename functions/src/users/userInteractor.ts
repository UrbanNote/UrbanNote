import { inject, injectable } from 'tsyringe';

import { UserProfileDoc } from './userProfileDoc';
import { IUserRepository } from './userRepository';
import { UserRolesDoc } from './userRolesDoc';
import { IAuthorizationService } from '../auth/authorizationService';
import { ApplicationError } from '../errors';

export interface IUserInteractor {
  /**
   * Creates a user's profile. If the requester's id is not the same as the user's id, the requester must have `admin` or `manageUsers` role.
   * @param requesterId
   * @param userId
   * @param email
   * @param firstName
   * @param lastName
   * @param language
   * @param chosenName Optional
   * @param pictureId Optional
   * @returns A promise that resolves when the user's profile has been created.
   * @throws If the user's profile already exists or if the requester does not have permission to create a user's profile.
   */
  createUserProfile(
    requesterId: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ): Promise<void>;

  /**
   * Creates a user's role document.
   * * If the requester's id is the same as the user's id, all roles must be set to `false`.
   * * Setting `admin` to `true` is only allowed for a requester with `admin` role.
   * * Setting any other role to `true` is only allowed for a requester with `userManagement` role.
   * @param requesterId
   * @param userId
   * @param admin Whether the user has admin role. Can only be set by a requester with `admin` role.
   * @param expenseManagement Whether the user has expense management role. Can only be set by a requester with `userManagement` role.
   * @param resourceManagement Whether the user has resource management role. Can only be set by a requester with `userManagement` role.
   * @param userManagement Whether the user has user management role. Can only be set by a requester with `userManagement` role.
   * @returns A promise that resolves when the user's role has been created.
   * @throws If the user's role already exists or if the requester does not have permission to create a user's role.
   */
  createUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ): Promise<void>;

  /**
   * Updates a user's profile document.
   * * If the requester's id is not the same as the user's id, the requester must have `admin` or `userManagement` role.
   * @param requesterId
   * @param userId
   * @param firstName
   * @param lastName
   * @param language
   * @param chosenName Optional
   * @param pictureId Optional
   * @returns A promise that resolves when the user's profile has been updated.
   * @throws If the user's profile does not exist or if the requester does not have permission to update a user's profile.
   */
  updateUserProfile(
    requesterId: string,
    userId: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ): Promise<void>;

  /**
   * Updates a user's roles document.
   * * If the requester's id is not the same as the user's id, the requester must have `admin` or `userManagement` role.
   * @param requesterId
   * @param userId
   * @param admin Whether the user has admin role. Can only be set by a requester with `admin` role.
   * @param expenseManagement Whether the user has expense management role. Can only be set by a requester with `userManagement` or `admin` role.
   * @param resourceManagement Whether the user has resource management role. Can only be set by a requester with `userManagement` or `admin` role.
   * @param userManagement Whether the user has user management role. Can only be set by a requester with `userManagement` or `admin` role.
   * @returns A promise that resolves when the user's roles has been updated.
   * @throws If the user's roles does not exist or if the requester does not have permission to update a user's roles.
   */
  updateUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ): Promise<void>;

  /**
   * Gets a user's profile document.
   * @param userId
   * @returns A promise that resolves when the userProfile has been retrieved.
   */
  getUserProfile(userId: string): Promise<UserProfileDoc | null>;

  /**
   * Gets a user's roles document.
   * @param userId
   * @returns A promise that resolves when the userRoles has been retrieved.
   */
  getUserRoles(userId: string): Promise<UserRolesDoc | null>;
}

@injectable()
export class UserInteractor implements IUserInteractor {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('AuthorizationService') private readonly authorizationService: IAuthorizationService,
  ) {}

  public async createUserProfile(
    requesterId: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ) {
    // If the requester is not the same as the creator, the requester must be an userManagement or an admin
    if (requesterId !== userId) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    const userProfileById = await this.userRepository.getUserProfileById(userId);
    if (userProfileById) {
      throw new ApplicationError('already-exists', 'userProfileAlreadyExists');
    }

    const userProfileByEmail = await this.userRepository.getUserProfileByEmail(email);
    if (userProfileByEmail) {
      throw new ApplicationError('already-exists', 'emailAlreadyTaken');
    }

    await this.userRepository.createUserProfile(
      requesterId,
      userId,
      email,
      firstName,
      lastName,
      language,
      chosenName,
      pictureId,
    );
  }

  public async createUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ) {
    /*
      Requires admin role to set the admin role.
      Requires userManagement role to create another's user roles entity or to give any role to the user.
    */
    if (requesterId !== userId || admin || expenseManagement || resourceManagement || userManagement) {
      await this.authorizationService.assertUserHasRoles(requesterId, {
        admin,
        userManagement: requesterId !== userId || expenseManagement || resourceManagement || userManagement,
      });
    }

    const userRoles = await this.userRepository.getUserRoles(userId);
    if (userRoles) {
      throw new ApplicationError('already-exists', 'userRolesAlreadyExist');
    }

    await this.userRepository.createUserRoles(
      requesterId,
      userId,
      admin,
      expenseManagement,
      resourceManagement,
      userManagement,
    );
  }

  public async updateUserProfile(
    requesterId: string,
    userId: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ) {
    if (requesterId !== userId) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    // If the requester is not admin, he can't update an user admin
    const userRoles = await this.userRepository.getUserRoles(userId);
    if (userRoles?.admin) {
      await this.authorizationService.assertUserIsAdmin(requesterId);
    }

    const userProfile = await this.userRepository.getUserProfileById(userId);
    if (!userProfile) {
      throw new ApplicationError('not-found', 'userProfileNotFound');
    }

    await this.userRepository.updateUserProfile(requesterId, userId, {
      firstName,
      lastName,
      language,
      chosenName,
      pictureId,
    });
  }

  public async updateUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ) {
    if (requesterId !== userId) {
      await this.authorizationService.assertUserHasUserManagementRole(requesterId);
    }

    // If the requester is not admin, he can't update the userRoles of an admin user and he can't update a user to make it with admin role
    const userRoles = await this.userRepository.getUserRoles(userId);
    if (userRoles?.admin || admin) {
      await this.authorizationService.assertUserIsAdmin(requesterId);
    }

    if (!userRoles) {
      throw new ApplicationError('not-found', 'userRolesNotFound');
    }

    await this.userRepository.updateUserRoles(requesterId, userId, {
      admin,
      expenseManagement,
      resourceManagement,
      userManagement,
    });
  }

  public async getUserProfile(userId: string): Promise<UserProfileDoc | null> {
    const userProfile = await this.userRepository.getUserProfileById(userId);
    return userProfile;
  }

  public async getUserRoles(userId: string): Promise<UserRolesDoc | null> {
    const userRoles = await this.userRepository.getUserRoles(userId);
    return userRoles;
  }
}
