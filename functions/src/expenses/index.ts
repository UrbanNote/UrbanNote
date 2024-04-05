import { document } from 'firebase-functions/v1/firestore';
import { onCall } from 'firebase-functions/v1/https';

import { IExpenseController } from './expenseController';
import { ExpenseDetailsDoc } from './expenseDetailsDoc';
import { IExpenseObserver } from './expenseObserver';
import container from '../container';

// On récupère le contrôleur depuis le conteneur d'injection de dépendances.
const expenseController = container.resolve<IExpenseController>('ExpenseController');
const expenseObserver = container.resolve<IExpenseObserver>('ExpenseObserver');

// Le module exporte les fonctions qui sont encapsulées par des onCall et autres triggers.
export default {
  // Functions
  createExpenseDetail: onCall(expenseController.createExpense.bind(expenseController)),
  updateExpenseDetail: onCall(expenseController.updateExpense.bind(expenseController)),

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
};
