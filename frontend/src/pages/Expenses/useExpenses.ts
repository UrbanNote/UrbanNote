import { useEffect, useState } from 'react';

import { onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import type { ExpenseDetails } from '$firebase/expenses';
import { getMyExpensesQuery } from '$firebase/expenses';
import { useAlerts } from '$hooks';
import { useAppSelector } from '$store';

export type UseExpensesReturn = {
  data: ExpenseDetails[] | undefined;
  error: Error | undefined;
  loading: boolean;
};

// TODO: add query params here
export function useExpenses(): UseExpensesReturn {
  const user = useAppSelector(state => state.user);
  const { t } = useTranslation('expenses');
  const alert = useAlerts();
  const [data, setData] = useState<ExpenseDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!user.id) return undefined;

    let unsubscribe = () => {};

    try {
      const expensesQuery = getMyExpensesQuery(user.id);
      unsubscribe = onSnapshot(expensesQuery, snapshot => {
        if (!data) {
          setLoading(false);
          setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ExpenseDetails));
          return;
        }

        snapshot.docChanges().forEach(change => {
          switch (change.type) {
            case 'removed':
              setData(prevExpenses => {
                prevExpenses?.filter(exp => exp.id !== change.doc.id);
                return prevExpenses;
              });
              break;
            case 'added':
            case 'modified':
              setData(prevExpenses => {
                const newExpense = change.doc.data() as ExpenseDetails;

                if (!prevExpenses) return [newExpense];
                const index = prevExpenses.findIndex(exp => exp.id === change.doc.id);
                if (index === -1) {
                  return [...prevExpenses, newExpense];
                }

                prevExpenses[index] = newExpense;
                return prevExpenses;
              });
              break;
          }
        });
      });
    } catch (error) {
      // TODO: handle known errors
      alert(t('useExpenses.errors.unknown'), 'danger');
      setError(error as Error);
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return { data, error, loading };
}

export default useExpenses;
