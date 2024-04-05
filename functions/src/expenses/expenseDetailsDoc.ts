import type { BaseEntity } from '../baseEntity';

export enum ExpenseStatus {
  ARCHIVED = 'archived',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum ExpenseCategories {
  TRAVEL = 'travel',
  PARKING = 'parking',
  EQUIPMENT = 'equipment',
  RESTAURANT = 'restaurant',
  CONVENIENCE = 'convenience',
  GROCERY = 'grocery',
}

/** Expense details type. This is the type of the expense details object that is stored in the database.*/
export type ExpenseDetails = {
  id: string;
  assignedToId: string;
  title: string;
  description?: string;
  date: string;
  amount: number;
  pictureURL?: string[];
  status: ExpenseStatus;
  category: ExpenseCategories;
};

/** Expense document type. Each expense should have a expense document.*/
export type ExpenseDetailsDoc = BaseEntity & ExpenseDetails;
