import { useEffect, useState } from 'react';

import { onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import type { ExpenseDetails } from '$firebase/expenses';
import { ExpenseStatus } from '$firebase/expenses';
import { queryExpenses } from '$firebase/expenses';
import { getMonthStartAndEnd } from '$helpers';
import { useAlerts } from '$hooks';

const MONTH_FIRST_DAY = parseInt(`${import.meta.env.VITE_EXPENSES_MONTH_FIRST_DAY || '1'}`);

export type UseExpensesArgs = {
  difference?: number;
  status: ExpenseStatus | null;
  userId: string;
};

export type UseExpensesReturn = {
  data: ExpenseDetails[] | undefined;
  error: Error | undefined;
  loading: boolean;
};

export function useExpenses({ difference = 0, status: statusProp, userId }: UseExpensesArgs): UseExpensesReturn {
  const { t } = useTranslation('expenses');
  const alert = useAlerts();
  const [data, setData] = useState<ExpenseDetails[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let unsubscribe = () => {};
    setData(undefined);
    setLoading(true);

    try {
      const [start, end] = getMonthStartAndEnd(difference, MONTH_FIRST_DAY);
      const status = !statusProp
        ? Object.values(ExpenseStatus).filter(s => s !== ExpenseStatus.ARCHIVED)
        : [statusProp];
      const expensesQuery = queryExpenses({ userId, start, end, status });
      unsubscribe = onSnapshot(expensesQuery, snapshot => {
        const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ExpenseDetails);
        setData(expensesData);
        setLoading(false);
      });
    } catch (error) {
      alert(t('useExpenses.errors.unknown'), 'danger');
      setError(error as Error);
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difference, statusProp, userId]);

  return { data, error, loading };
}

export default useExpenses;
