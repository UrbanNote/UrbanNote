import { CallableContext } from 'firebase-functions/v1/https';
import Joi from 'joi';
import { inject, injectable } from 'tsyringe';

import { IAuthInteractor } from './authInteractor';
import { AuthUserDetails } from './authUserDetails';
import { UserDetails } from './userDetails';
import { UserWithName } from './userWithName';
import { ApplicationError, handleError } from '../errors';
import { IUserInteractor } from '../users/userInteractor';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  language: string;
  chosenName?: string;
  pictureId?: string;
  disabled: boolean;
  admin?: boolean;
  expenseManagement?: boolean;
  resourceManagement?: boolean;
  userManagement?: boolean;
};

export type DisableUserData = {
  id: string;
};

export type EnableUserData = {
  id: string;
};

export type GetUsersData = {
  /** Items per page. */
  ipp: number;

  /** The next page token. If not specified, returns users starting without any offset. */
  pageToken?: string;

  /** The disabled filter result. If not specified, return all users. */
  disabledFilter?: boolean;

  /** The search bar filter. If not specified, return all users. */
  searchBarFilter?: string;
};

export type GetUsersResponse = {
  users: UserDetails[];

  /** The next page token. If not specified, returns users starting without any offset. */
  pageToken?: string;
};

export type GetUserNamesResponse = UserWithName[];

export type GetAuthUsersResponse = {
  users: AuthUserDetails[];

  /** The next page token. If not specified, returns users starting without any offset. */
  pageToken?: string;
};

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  emailVerified: Joi.boolean().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  language: Joi.string().required(),
  chosenName: Joi.string().optional().allow(''),
  disabled: Joi.boolean().required(),
  admin: Joi.boolean().optional(),
  expenseManagement: Joi.boolean().optional(),
  resourceManagement: Joi.boolean().optional(),
  userManagement: Joi.boolean().optional(),
});

/**
 * Controller for the `auth` module. Access to this controller's methods requires the `userManagement` role.
 */
export interface IAuthController {
  /**
   * Creates all the required user data: auth user, user profile and user roles.
   */
  createUser(data: CreateUserData, context: CallableContext): Promise<void>;

  /**
   * Updates an Auth user in the Auth provider.
   */
  updateUser(data: AuthUserDetails, context: CallableContext): Promise<void>;

  /**
   * Disables an Auth user in the Auth provider. A disabled user cannot sign in.
   */
  disableUser(data: DisableUserData, context: CallableContext): Promise<void>;

  /**
   * Enables a disabled Auth user in the Auth provider.
   */
  enableUser(data: EnableUserData, context: CallableContext): Promise<void>;

  /**
   * Gets a list of users and their details.
   */
  getUsers(data: GetUsersData, context: CallableContext): Promise<GetUsersResponse>;

  /**
   * Gets a list of user's id and names.
   */
  getUserNames(data: object, context: CallableContext): Promise<GetUserNamesResponse>;

  /**
   * Gets a list of auth users and their details.
   */
  getAuthUsers(data: GetUsersData, context: CallableContext): Promise<GetAuthUsersResponse>;
}

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject('AuthInteractor') private readonly authInteractor: IAuthInteractor,
    @inject('UserInteractor') private readonly userInteractor: IUserInteractor,
  ) {}

  public async createUser(data: CreateUserData, context: CallableContext): Promise<void> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      const validationResult = createUserSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      const displayName = data.firstName + ' ' + data.lastName;

      const authUser = await this.authInteractor.createAuthUser(
        context.auth.uid,
        data.email,
        displayName,
        !data.disabled,
        data.admin ?? false,
        data.emailVerified,
      );
      await this.userInteractor.createUserRoles(
        context.auth.uid,
        authUser.uid,
        Boolean(data.admin),
        Boolean(data.expenseManagement),
        Boolean(data.resourceManagement),
        Boolean(data.userManagement),
      );

      await this.userInteractor.createUserProfile(
        context.auth.uid,
        authUser.uid,
        authUser.email || data.email.toLowerCase(),
        data.firstName,
        data.lastName,
        data.language,
        data.chosenName,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async updateUser(data: AuthUserDetails, context: CallableContext): Promise<void> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      await this.authInteractor.updateAuthUser(
        context.auth.uid,
        data.disabled,
        data.email,
        data.displayName,
        data.emailVerified,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async disableUser(data: DisableUserData, context: CallableContext): Promise<void> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      await this.authInteractor.disableUser(context.auth.uid, data.id);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async enableUser(data: EnableUserData, context: CallableContext): Promise<void> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      await this.authInteractor.enableUser(context.auth.uid, data.id);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getUsers(data: GetUsersData, context: CallableContext): Promise<GetUsersResponse> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      const [users, pageToken] = await this.authInteractor.getUsers(context.auth.uid, data.ipp, data.pageToken);
      return { users, pageToken };
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getUserNames(data: object, context: CallableContext): Promise<GetUserNamesResponse> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      const userNames = await this.authInteractor.getUserNames();
      return userNames;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getAuthUsers(data: GetUsersData, context: CallableContext): Promise<GetAuthUsersResponse> {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'Unauthenticated');
      }

      const [users, pageToken] = await this.authInteractor.getAuthUsers(
        context.auth.uid,
        data.ipp,
        data.pageToken,
        data.disabledFilter,
        data.searchBarFilter
          ?.toLowerCase() // Met la string en LowerCase
          .normalize('NFD') // Décompose les caractères avec accent
          .replace(/[\u0300-\u036f\-\s]/g, ''), // Remplace les accents, les tirets et les espaces par un string vide
      );
      return { users, pageToken };
    } catch (error) {
      throw handleError(error);
    }
  }
}
