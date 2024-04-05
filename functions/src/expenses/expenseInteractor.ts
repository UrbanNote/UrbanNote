import { inject, injectable } from 'tsyringe';

import { ExpenseCategories, ExpenseDetailsDoc, ExpenseStatus } from './expenseDetailsDoc';
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
   *throws if the expense does not exist or if the requester doesn't have the expenseManagement or admin role.
   */
  updateExpense(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetailsDoc, 'id' | 'date'>>,
  ): Promise<void>;

  /**
   * Updates the status of an expense.
   * @returns A promise that resolves when the expense has been updated.
   * throws if the requester doesn't have the expenseManagement or admin role
   */
  updateExpenseStatus(requesterId: string, expenseId: string, status: ExpenseStatus): Promise<void>;

  /** Delete an expense.
   * @returns A promise that resolves when the expense has been deleted.
   *throws if the expense does not exist or if the requester is not the creator, an expenseManagement or an admin.
   */
  deleteExpense(requesterId: string, expenseId: string): Promise<void>;

  /** Delete all expenses.
   * @returns A promise that resolves when the expenses have been deleted.
   *throws if the requester is not an admin or an expenseManagement.
   */
  deleteAllExpenses(requesterId: string, assignedToId: string): Promise<void>;
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

  public async updateExpense(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetailsDoc, 'id' | 'status'>>,
  ) {
    // If the requester is not the same as the creator, the requester must be an expenseManagement or an admin
    if (requesterId !== updates.assignedToId) {
      await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);
    }

    const expense = await this.expenseRepository.getExpenseDetailsById(expenseId);
    if (!expense) {
      throw new ApplicationError('not-found', 'expenseNotFound');
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

  public async updateExpenseStatus(requesterId: string, expenseId: string, status: ExpenseStatus) {
    await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);

    const expense = await this.expenseRepository.getExpenseDetailsById(expenseId);
    if (!expense) {
      throw new ApplicationError('not-found', 'expenseNotFound');
    }

    if (expense.status === status) {
      throw new ApplicationError('invalid-argument', 'expenseStatusNotChanged');
    }

    await this.expenseRepository.updateExpenseDetails(requesterId, expenseId, { status });
  }

  public async deleteExpense(requesterId: string, expenseId: string) {
    const expense = await this.expenseRepository.getExpenseDetailsById(expenseId);
    if (!expense) {
      throw new ApplicationError('not-found', 'expenseNotFound');
    }

    // If the requester is not the same as the creator, the requester must be an expenseManagement or an admin
    if (requesterId !== expense.assignedToId) {
      await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);
    }

    await this.expenseRepository.deleteExpenseDetailsById(expenseId);
  }

  public async deleteAllExpenses(requesterId: string, assignedToId: string) {
    // if the requester is not an admin or an expenseManagement, it is impossible to delete all expenses
    await this.authorizationService.assertUserHasExpenseManagementRole(requesterId);

    if (assignedToId === '' || assignedToId === null || assignedToId === undefined) {
      throw new ApplicationError('not-found', 'userNotFound');
    }

    await this.expenseRepository.deleteAllExpenseDetails(assignedToId);
  }
}
