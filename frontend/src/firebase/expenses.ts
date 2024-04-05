import { collection, query, where, getDoc, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { db, functions } from '$firebase';

export enum ExpenseStatus {
  APPROVED = 'approved',
  ARCHIVED = 'archived',
  PENDING = 'pending',
  REJECTED = 'rejected',
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
  updates: Partial<Omit<ExpenseDetails, 'id'>>;
};

// Les fonctions prend des données en entrée, envoie une requête au serveur, et renvoie les données de la réponse obtenue du serveur.
export async function createExpense(data: CreateExpenseData) {
  const request = httpsCallable<CreateExpenseData, Promise<void>>(functions, 'expenses-createExpenseDetail');
  await request(data);
}

export async function updateExpense(data: UpdateExpenseData) {
  const request = httpsCallable<UpdateExpenseData, Promise<void>>(functions, 'expenses-updateExpenseDetail');
  await request(data);
}

export function getMyExpensesQuery(userId: string) {
  return query(collection(db, 'expenseDetails'), where('assignedToId', '==', userId));
}

export async function getExpenseDetailsById(expenseId: string) {
  const docRef = doc(db, 'expenseDetails', expenseId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as ExpenseDetails;
}
