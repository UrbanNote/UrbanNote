import type { ExpenseStatus } from '$firebase/expenses';

export type FilterFormValues = {
  assignedToId: string;
  difference: number;
  status: ExpenseStatus | '';
};
