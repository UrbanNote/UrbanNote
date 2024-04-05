import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';

import type { ExpenseStatus } from '$firebase/expenses';
import { ExpenseCategories } from '$firebase/expenses';
import { useScreenMinWidth } from '$hooks';

import ExpenseCard from './ExpenseCard';
import type { UseExpensesReturn } from './useExpenses';

const CATEGORIES_ORDER: ExpenseCategories[] = [
  ExpenseCategories.TRAVEL,
  ExpenseCategories.PARKING,
  ExpenseCategories.EQUIPMENT,
  ExpenseCategories.RESTAURANT,
  ExpenseCategories.CONVENIENCE,
  ExpenseCategories.GROCERY,
];

type ViewProps = {
  isMe: boolean;
  expenses: UseExpensesReturn;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => Promise<void>;
  onClickViewPictures: (id: string) => void;
};

// TODO: add table view, filters, search and pagination once expense management is implemented
function View({ isMe, expenses, onEdit, onDelete, onStatusChange, onClickViewPictures }: ViewProps) {
  const isAboveMdBreakpoint = useScreenMinWidth('md');
  const { t } = useTranslation('expenses');

  if (expenses.error) return <p>{t('view.error')}</p>;

  if (expenses.loading) return <Spinner />;

  if (!expenses.data?.length) return <p>{t(`view.empty.${isMe ? 'me' : 'other'}`)}</p>;

  const columns = isAboveMdBreakpoint ? 2 : 1;

  // order by category first (lowest to highest), then by date (newest to oldest)
  const sortedExpenses = expenses.data.sort((a, b) => {
    if (a.category === b.category) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return CATEGORIES_ORDER.indexOf(a.category) - CATEGORIES_ORDER.indexOf(b.category);
  });

  return (
    <>
      <div
        className="Expenses__View d-grid gap-3 gap-md-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}>
        {sortedExpenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={onDelete}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onClickViewPictures={onClickViewPictures}
          />
        ))}
      </div>
    </>
  );
}

export default View;
