import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { injectable } from 'tsyringe';

import { ExpenseCategories, ExpenseDetails, ExpenseDetailsDoc, ExpenseStatus } from './expenseDetailsDoc';
/**
 * Establishes the connection between the application and its expense data source
 */

export interface IExpenseRepository {
  createExpenseDetail(
    requesterId: string,
    assignedToId: string,
    title: string,
    date: string,
    amount: number,
    category: ExpenseCategories,
    pictureURL?: string[],
    description?: string,
  ): Promise<ExpenseDetailsDoc>;

  getExpenseDetailsById(expenseId: string): Promise<ExpenseDetailsDoc | null>;

  updateExpenseDetails(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetails, 'id'>>,
  ): Promise<void>;

  getListExpenseDetails(ipp: number): Promise<ExpenseDetailsDoc[]>;
}

@injectable()
export class ExpenseRepository implements IExpenseRepository {
  private readonly expenseDetailsCollection = firestore().collection('expenseDetails');

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
    const doc = this.expenseDetailsCollection.doc();
    const expenseDetailsDoc: ExpenseDetailsDoc = {
      id: doc.id,
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
    };
    await doc.set(expenseDetailsDoc);

    return expenseDetailsDoc;
  }

  public async getExpenseDetailsById(expenseId: string) {
    const expenseDetailsDoc = await this.expenseDetailsCollection.doc(expenseId).get();
    if (!expenseDetailsDoc.exists) {
      return null;
    }
    return expenseDetailsDoc.data() as ExpenseDetailsDoc;
  }

  public async updateExpenseDetails(
    requesterId: string,
    expenseId: string,
    updates: Partial<Omit<ExpenseDetails, 'id'>>,
  ) {
    const expenseDetailsDoc = {
      ...updates,
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
    };
    await this.expenseDetailsCollection.doc(expenseId).update(expenseDetailsDoc);
  }

  public async getListExpenseDetails(ipp: number): Promise<ExpenseDetailsDoc[]> {
    const query = this.expenseDetailsCollection.orderBy('createdAt').limit(ipp);
    const expenseDetailsDocs = await query.get();
    return expenseDetailsDocs.docs.map(doc => doc.data() as ExpenseDetailsDoc);
  }
}
