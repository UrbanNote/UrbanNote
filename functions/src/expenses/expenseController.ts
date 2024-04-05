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
  updates: Partial<Omit<ExpenseDetails, 'id'>>;
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
    status: Joi.string().valid(...Object.values(ExpenseStatus)),
    category: Joi.string().valid(...Object.values(ExpenseCategories)),
  }),
});

/**
 * Controller for the `expense` module.
 */
export interface IExpenseController {
  createExpense(data: CreateExpenseData, context: CallableContext): Promise<void>;
  updateExpense(data: UpdateExpenseData, context: CallableContext): Promise<void>;
}

@injectable()
export class ExpenseController implements IExpenseController {
  // inject the interactor to use its methods
  constructor(@inject('ExpenseInteractor') private readonly expenseInteractor: IExpenseInteractor) {}
  /* verified if the data is valid and create an expense.
   *verifies if the requester is not the same as the creator, the requester must be an expenseManagement.
   */
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

  /* verified if the data is valid and update an expense.
   *verifies if the requester is not the same as the creator, the requester must be an expenseManagement or an admin.
   */
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
}
