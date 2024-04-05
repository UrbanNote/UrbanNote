import { inject, injectable } from 'tsyringe';

import { IUserRepository } from './userRepository';
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
    const userProfileById = await this.userRepository.getUserProfileById(userId);
    if (userProfileById) {
      throw new ApplicationError('already-exists', 'UserProfileAlreadyExists');
    }

    const userProfileByEmail = await this.userRepository.getUserProfileByEmail(email);
    if (userProfileByEmail) {
      throw new ApplicationError('already-exists', 'EmailAlreadyTaken');
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
    await this.authorizationService.assertUserHasRoles(requesterId, {
      admin: admin,
      userManagement: expenseManagement || resourceManagement || userManagement,
    });

    const userRoles = await this.userRepository.getUserRoles(userId);
    if (userRoles) {
      throw new ApplicationError('already-exists', 'UserRolesAlreadyExist');
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
}
