import { CallableContext } from 'firebase-functions/v1/https';
import Joi from 'joi';
import { inject, injectable } from 'tsyringe';

import { ExpenseCategories, ExpenseDetails, ExpenseStatus } from './expenseDetailsDoc';
import { IExpenseInteractor } from './expenseInteractor';
import { ApplicationError, handleError } from '../errors';

export type CreateExpenseData = {
  assignedToId: string;
  title: string;
  description?: string;
  date: string;
  amount: number;
  category: ExpenseCategories;
  pictureURL?: string[];
};

export type UpdateExpenseData = {
  expenseId: string;
  updates: Partial<Omit<ExpenseDetails, 'id' | 'status'>>;
};

export type UpdateExpenseStatusData = {
  expenseId: string;
  status: ExpenseStatus;
};

const createExpenseDataSchema = Joi.object({
  assignedToId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  date: Joi.string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/)
    .required(),
  amount: Joi.number().required(),
  pictureURL: Joi.array().min(0),
  category: Joi.string()
    .valid(...Object.values(ExpenseCategories))
    .required(),
});

const updateExpenseDataSchema = Joi.object({
  expenseId: Joi.string().required(),
  updates: Joi.object({
    assignedToId: Joi.string(),
    title: Joi.string(),
    description: Joi.string().allow(''),
    date: Joi.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
    amount: Joi.number().min(0.01),
    pictureURL: Joi.array().items(Joi.string()),
    category: Joi.string().valid(...Object.values(ExpenseCategories)),
  }),
});

const updateExpenseStatusDataSchema = Joi.object({
  expenseId: Joi.string().required(),
  status: Joi.string().valid(...Object.values(ExpenseStatus)),
});

/**
 * Controller for the `expense` module.
 */
export interface IExpenseController {
  createExpense(data: CreateExpenseData, context: CallableContext): Promise<void>;
  updateExpense(data: UpdateExpenseData, context: CallableContext): Promise<void>;
  updateExpenseStatus(data: UpdateExpenseStatusData, context: CallableContext): Promise<void>;
  deleteExpense(expenseId: string, context: CallableContext): Promise<void>;
  deleteAllExpenses(assignedToId: string, context: CallableContext): Promise<void>;
}

@injectable()
export class ExpenseController implements IExpenseController {
  constructor(@inject('ExpenseInteractor') private readonly expenseInteractor: IExpenseInteractor) {}
  public async createExpense(data: CreateExpenseData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = createExpenseDataSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.expenseInteractor.createExpense(
        context.auth?.uid ?? '',
        data.assignedToId,
        data.title,
        data.date,
        data.amount,
        data.category,
        data.pictureURL,
        data.description,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async updateExpense(data: UpdateExpenseData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = updateExpenseDataSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.expenseInteractor.updateExpense(context.auth.uid, data.expenseId, data.updates);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async updateExpenseStatus(data: UpdateExpenseStatusData, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      const validationResult = updateExpenseStatusDataSchema.validate(data);
      if (validationResult.error) {
        throw validationResult.error;
      }

      await this.expenseInteractor.updateExpenseStatus(context.auth.uid, data.expenseId, data.status);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async deleteExpense(expenseId: string, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      await this.expenseInteractor.deleteExpense(context.auth.uid, expenseId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async deleteAllExpenses(assignedToId: string, context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      await this.expenseInteractor.deleteAllExpenses(context.auth.uid, assignedToId);
    } catch (error) {
      throw handleError(error);
    }
  }
}
