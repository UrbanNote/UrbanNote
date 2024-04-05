import { document } from 'firebase-functions/v1/firestore';
import { onCall } from 'firebase-functions/v1/https';

import { IExpenseController } from './expenseController';
import { ExpenseDetailsDoc } from './expenseDetailsDoc';
import { IExpenseObserver } from './expenseObserver';
import container from '../container';

const expenseController = container.resolve<IExpenseController>('ExpenseController');
const expenseObserver = container.resolve<IExpenseObserver>('ExpenseObserver');

export default {
  // Functions
  createExpense: onCall(expenseController.createExpense.bind(expenseController)),
  updateExpense: onCall(expenseController.updateExpense.bind(expenseController)),
  updateExpenseStatus: onCall(expenseController.updateExpenseStatus.bind(expenseController)),
  deleteExpense: onCall(expenseController.deleteExpense.bind(expenseController)),
  deleteAllExpenses: onCall(expenseController.deleteAllExpenses.bind(expenseController)),

  // Triggers
  onExpenseCreated: document('expenseDetails/{expenseId}').onCreate(snapshot =>
    expenseObserver.onExpenseCreated.bind(expenseObserver)(snapshot.data() as ExpenseDetailsDoc),
  ),
  onExpenseUpdated: document('expenseDetails/{expenseId}').onUpdate(change =>
    expenseObserver.onExpenseUpdated.bind(expenseObserver)(
      change.before.data() as ExpenseDetailsDoc,
      change.after.data() as ExpenseDetailsDoc,
    ),
  ),
  onExpenseDeleted: document('expenseDetails/{expenseId}').onDelete(snapshot =>
    expenseObserver.onExpenseDeleted.bind(expenseObserver)(snapshot.data() as ExpenseDetailsDoc),
  ),
};
