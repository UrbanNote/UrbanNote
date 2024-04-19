import { CallableContext } from 'firebase-functions/v1/https';
import Joi from 'joi';
import { inject, injectable } from 'tsyringe';

import { IUserInteractor } from './userInteractor';
import { UserProfileDoc } from './userProfileDoc';
import { UserRolesDoc } from './userRolesDoc';
import { ApplicationError, handleError } from '../errors';

export type CreateUserProfileData = {
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
  pictureId?: string;
};

export type CreateUserRolesData = {
  userId?: string;
  admin?: boolean;
  expenseManagement?: boolean;
  resourceManagement?: boolean;
  userManagement?: boolean;
};

export type UpdateUserProfileData = {
  userId?: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
  pictureId?: string;
};

export type UpdateUserRolesData = {
  userId?: string;
  admin: boolean;
  expenseManagement: boolean;
  resourceManagement: boolean;
  userManagement: boolean;
};

const createUserProfileSchema = Joi.object({
  userId: Joi.string().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  language: Joi.string().required(),
  chosenName: Joi.string().optional().allow(''),
  pictureId: Joi.string().optional().allow(''),
});

const createUserRolesSchema = Joi.object({
  userId: Joi.string().optional(),
  admin: Joi.boolean().optional(),
  expenseManagement: Joi.boolean().optional(),
  resourceManagement: Joi.boolean().optional(),
  userManagement: Joi.boolean().optional(),
});

const updateUserProfileSchema = Joi.object({
  userId: Joi.string().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  language: Joi.string().required(),
  chosenName: Joi.string().optional().allow(''),
  pictureId: Joi.string().optional().allow(''),
});

const updateUserRolesSchema = Joi.object({
  userId: Joi.string().optional(),
  admin: Joi.boolean().required(),
  expenseManagement: Joi.boolean().required(),
  resourceManagement: Joi.boolean().required(),
  userManagement: Joi.boolean().required(),
});

/**
 * Controller for the `users` module.
 */
export interface IUserController {
  /**
   * Creates a user profile. Requires `userManagement` role when the requester is different
   * from the user. If the userId is not specified, the requester's id is used.
   */
  createUserProfile(data: CreateUserProfileData, context: CallableContext): Promise<void>;

  /**
   * Creates a user's role document. Requires `userManagement` role if the requester is different
   * from the user (or `admin` role if setting the `admin` boolean to `true`). If the userId is not
   * specified, the requester's id is used.
   */
  createUserRoles(data: CreateUserRolesData, context: CallableContext): Promise<void>;

  /**
   * Updates a user's profile document. Requires `userManagement` role if the requester is different
   * from the user. If the userId is not specified, the requester's id is used.
   */
  updateUserProfile(data: UpdateUserProfileData, context: CallableContext): Promise<void>;

  /**
   * Updates a user's roles document. Requires `userManagement` role if the requester is different
   * from the user. If the userId is not specified, the requester's id is used.
   */
  updateUserRoles(data: UpdateUserRolesData, context: CallableContext): Promise<void>;

  /**
   * Gets the user's profile
   */
  getUserProfile(userId: string, context: CallableContext): Promise<UserProfileDoc | null>;

  /**
   * Gets the user's roles
   */
  getUserRoles(userId: string, context: CallableContext): Promise<UserRolesDoc | null>;
}

@injectable()
export class UserController implements IUserController {
  constructor(@inject('UserInteractor') private userInteractor: IUserInteractor) {}

  public async createUserProfile(data: CreateUserProfileData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = createUserProfileSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.userInteractor.createUserProfile(
        context.auth.uid,
        data.userId ?? context.auth.uid,
        data.email,
        data.firstName,
        data.lastName,
        data.language,
        data.chosenName,
        data.pictureId,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async createUserRoles(data: CreateUserRolesData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = createUserRolesSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.userInteractor.createUserRoles(
        context.auth.uid,
        data.userId ?? context.auth.uid,
        data.admin ?? false,
        data.expenseManagement ?? false,
        data.resourceManagement ?? false,
        data.userManagement ?? false,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async updateUserProfile(data: UpdateUserProfileData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = updateUserProfileSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.userInteractor.updateUserProfile(
        context.auth.uid,
        data.userId ?? context.auth.uid,
        data.firstName,
        data.lastName,
        data.language,
        data.chosenName,
        data.pictureId,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async updateUserRoles(data: UpdateUserRolesData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = updateUserRolesSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.userInteractor.updateUserRoles(
        context.auth.uid,
        data.userId ?? context.auth.uid,
        data.admin,
        data.expenseManagement,
        data.resourceManagement,
        data.userManagement,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getUserProfile(userId: string, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      return await this.userInteractor.getUserProfile(userId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getUserRoles(userId: string, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      return await this.userInteractor.getUserRoles(userId);
    } catch (error) {
      throw handleError(error);
    }
  }
}
