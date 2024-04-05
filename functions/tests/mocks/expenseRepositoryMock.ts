import { Timestamp } from 'firebase-admin/firestore';
import { injectable } from 'tsyringe';

import { ExpenseCategories, ExpenseDetailsDoc, ExpenseStatus } from '../../src/expenses/expenseDetailsDoc';
import { IExpenseRepository } from '../../src/expenses/expenseRepository';

// creation d'un mock qui permet de simuler le comportement de la classe ExpenseRepository
@injectable()
export class ExpenseRepositoryMock implements IExpenseRepository {
  // permet de stocker les dépenses
  private readonly expenseDetails: Map<string, ExpenseDetailsDoc> = new Map();

  public async createExpenseDetail(
    requesterId: string,
    assignedToId: string,
    title: string,
    date: string,
    amount: number,
    category: ExpenseCategories,
    pictureURL?: string[],
    description?: string,
  ): Promise<ExpenseDetailsDoc> {
    this.expenseDetails.set(assignedToId, {
      id: assignedToId,
      createdBy: requesterId,
      createdAt: Timestamp.now(),
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
      assignedToId,
      title,
      description,
      date,
      amount,
      category,
      pictureURL,
      status: ExpenseStatus.PENDING,
    });

    return this.expenseDetails.get(assignedToId)!;
  }

  public async getExpenseDetailsById(expenseId: string): Promise<ExpenseDetailsDoc | null> {
    return this.expenseDetails.get(expenseId) ?? null;
  }

  public async updateExpenseDetails(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetailsDoc, 'id'>>,
  ): Promise<void> {
    const expense = this.expenseDetails.get(expenseId);
    if (!expense) {
      throw new Error('Expense not found');
    }
    this.expenseDetails.set(expenseId, {
      ...expense,
      ...updates,
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
    });
  }

  public async getListExpenseDetails(ipp: number): Promise<ExpenseDetailsDoc[]> {
    return Array.from(this.expenseDetails.values()).slice(0, ipp);
  }
}
