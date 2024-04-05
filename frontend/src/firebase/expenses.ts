import { collection, query, where, getDoc, doc, startAt, endAt, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { db, functions } from '$firebase';

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum ExpenseCategories {
  TRAVEL = 'travel',
  PARKING = 'parking',
  EQUIPMENT = 'equipment',
  RESTAURANT = 'restaurant',
  CONVENIENCE = 'convenience',
  GROCERY = 'grocery',
}

export type CreateExpenseData = {
  assignedToId: string;
  title: string;
  date: string;
  amount: number;
  category: ExpenseCategories;
  pictureURL?: string[];
  description?: string;
};

export type ExpenseDetails = {
  id: string;
  assignedToId: string;
  title: string;
  description?: string;
  date: string;
  amount: number;
  category: ExpenseCategories;
  pictureURL?: string[];
  status: ExpenseStatus;
};

export type UpdateExpenseData = {
  expenseId: string;
  updates: Partial<Omit<ExpenseDetails, 'id' | 'status'>>;
};

export type UpdateExpenseStatusData = {
  expenseId: string;
  status: ExpenseStatus;
};

export type QueryExpensesOptions = {
  userId?: string;
  status?: ExpenseStatus[];
} & (
  | {
      /** Date in YYYY/MM/DD format.  */
      start: string;
      /** Date in YYYY/MM/DD format. */
      end: string;
    }
  | { start: undefined; end: undefined }
);

export async function createExpense(data: CreateExpenseData) {
  const request = httpsCallable<CreateExpenseData, Promise<void>>(functions, 'expenses-createExpense');
  await request(data);
}

export async function updateExpense(data: UpdateExpenseData) {
  const request = httpsCallable<UpdateExpenseData, Promise<void>>(functions, 'expenses-updateExpense');
  await request(data);
}

export async function updateExpenseStatus(data: UpdateExpenseStatusData) {
  const request = httpsCallable<UpdateExpenseStatusData, Promise<void>>(functions, 'expenses-updateExpenseStatus');
  await request(data);
}

export function queryExpenses({ userId, start, end, status }: QueryExpensesOptions) {
  let q = query(collection(db, 'expenseDetails'));

  if (userId) {
    q = query(q, where('assignedToId', '==', userId));
  }

  if (status) {
    q = query(q, where('status', 'in', status));
  }

  if (start && end) {
    q = query(q, orderBy('date'), startAt(start), endAt(end));
  }

  return q;
}

export async function getExpenseDetailsById(expenseId: string) {
  const docRef = doc(db, 'expenseDetails', expenseId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as ExpenseDetails;
}

export async function deleteExpense(expenseId: string) {
  const request = httpsCallable<string, Promise<void>>(functions, 'expenses-deleteExpense');
  await request(expenseId);
}

export async function deleteAllExpenses(assignedToId: string) {
  const request = httpsCallable<string, Promise<void>>(functions, 'expenses-deleteAllExpenses');
  await request(assignedToId);
}
