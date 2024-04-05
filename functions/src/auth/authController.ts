import { CallableContext } from 'firebase-functions/v1/https';
import Joi from 'joi';
import { inject, injectable } from 'tsyringe';

import { IAuthInteractor } from './authInteractor';
import { UserDetails } from './userDetails';
import { ApplicationError, handleError } from '../errors';
import { IUserInteractor } from '../users/userInteractor';

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
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
};

export type GetUsersResponse = {
  users: UserDetails[];

  /** The next page token. If not specified, returns users starting without any offset. */
  pageToken?: string;
};

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  language: Joi.string().required(),
  chosenName: Joi.string().optional().allow(''),
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

      const authUser = await this.authInteractor.createAuthUser(context.auth.uid, data.email);
      await this.userInteractor.createUserProfile(
        context.auth.uid,
        authUser.uid,
        authUser.email || data.email.toLowerCase(),
        data.firstName,
        data.lastName,
        data.language,
        data.chosenName,
      );

      await this.userInteractor.createUserRoles(
        context.auth.uid,
        authUser.uid,
        Boolean(data.admin),
        Boolean(data.expenseManagement),
        Boolean(data.resourceManagement),
        Boolean(data.userManagement),
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
}
