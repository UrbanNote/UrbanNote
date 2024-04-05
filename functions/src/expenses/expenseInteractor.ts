import { inject, injectable } from 'tsyringe';

import { ExpenseCategories, ExpenseDetailsDoc } from './expenseDetailsDoc';
import { IAuthorizationService } from '../auth/authorizationService';
import { ApplicationError } from '../errors';
import { IExpenseRepository } from '../expenses/expenseRepository';

export interface IExpenseInteractor {
  /** Create an expense. If the requester is not the same as the creator, the requester must be an expenseManagement.
   * @returns A promise that resolves when the expense has been created.
   *throws if the expense already exists or if the requester is not the creator or an expenseManagement.
   */
  createExpense(
    requesterId: string,
    assignedToId: string,
    title: string,
    date: string,
    amount: number,
    category: ExpenseCategories,
    pictureURL?: string[],
    description?: string,
  ): Promise<void>;

  /** Get an expense.
   * @returns A promise that resolves when the expense has been retrieved.
   *throws if the expense does not exist or if the requester is not the creator.
   */
  getExpenses(ipp: number): Promise<ExpenseDetailsDoc[]>;

  /** Update an expense.
   * @returns A promise that resolves when the expense has been updated.
   *throws if the expense does not exist or if the requester is not the creator, an expenseManagement or an admin.
   */
  updateExpense(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetailsDoc, 'id' | 'date'>>,
  ): Promise<void>;
}

@injectable()
export class ExpenseInteractor implements IExpenseInteractor {
  // inject the repository to use its methods
  constructor(
    @inject('ExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    @inject('AuthorizationService') private readonly authorizationService: IAuthorizationService,
  ) {}

  public async createExpense(
    requesterId: string,
    assignedToId: string,
    title: string,
    date: string,
    amount: number,
    category: ExpenseCategories,
    pictureURL?: string[],
    description?: string,
  ) {
    // If the requester is not the same as the creator, the requester must be an expenseManagement or an admin
    if (requesterId !== assignedToId) {
      await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);
    }

    // if the amount is negative, it is impossible to create the expense
    if (amount <= 0) {
      throw new ApplicationError('invalid-argument', 'expenseMinimumAmount');
    }

    const expenseDate = new Date(date);
    if (expenseDate > new Date()) {
      throw new ApplicationError('invalid-argument', 'expenseMaximumDate');
    }

    await this.expenseRepository.createExpenseDetail(
      requesterId,
      assignedToId,
      title,
      date,
      amount,
      category,
      pictureURL,
      description,
    );
  }

  public async getExpenses(ipp: number): Promise<ExpenseDetailsDoc[]> {
    const listExpensesResult = await this.expenseRepository.getListExpenseDetails(ipp);
    return listExpensesResult;
  }

  public async updateExpense(requesterId: string, expenseId: string, updates: Partial<Omit<ExpenseDetailsDoc, 'id'>>) {
    // If the requester is not the same as the creator, the requester must be an expenseManagement or an admin
    if (requesterId !== updates.assignedToId) {
      await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);
    }

    const expense = await this.expenseRepository.getExpenseDetailsById(expenseId);
    if (!expense) {
      throw new ApplicationError('not-found', 'expenseNotFound');
    }

    // if ths status is being accepted, we cannot allow to update the expense and the requester is not an admin or expenseManagement
    if (updates.status === 'accepted') {
      throw new ApplicationError('permission-denied', 'acceptedExpenseNotEditable');
    }

    // if the expense date is more than 1 year, it is impossible to update
    // calculate the date one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const expenseDate = new Date(expense.date);

    if (expenseDate < oneYearAgo) {
      throw new ApplicationError('invalid-argument', 'oldExpenseNotEditable');
    }

    await this.expenseRepository.updateExpenseDetails(requesterId, expenseId, updates);
  }
}
