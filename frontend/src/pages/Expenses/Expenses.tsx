import { useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { Plus, XCircle } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { ConfirmationSlideOut } from '$components';
import { useAlerts, useAppLayout, usePageDetails } from '$hooks';

import CreateOrEditSlideOut from './CreateOrEdit';
import useExpenses from './useExpenses';
import View from './View';

import './Expenses.scss';

function Expenses() {
  const alert = useAlerts();
  const { t } = useTranslation('expenses');
  const isLayoutHorizontal = useAppLayout('horizontal');
  usePageDetails({
    title: t('title'),
    background: isLayoutHorizontal ? 'beige' : 'transparent',
  });

  const [showCreateOrEditSlideOut, setShowCreateOrEditSlideOut] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState<string | null>(null);
  const [expenseIdToEdit, setExpenseIdToEdit] = useState<string | null>(null);

  const expenses = useExpenses();

  const deleteExpense = useMutation({
    mutationKey: ['deleteExpense'],
    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
    mutationFn: async (_: string) => {
      try {
        throw new Error('Not implemented.');
        alert('delete.success', 'success');
      } catch (error) {
        // TODO: handle known errors
        alert('errors.unexpected', 'danger');
      }
    },
  });

  const expenseToEdit = useMemo(() => {
    if (!expenseIdToEdit || !expenses.data || !expenses.data.length) return undefined;
    return expenses.data.find(expense => expense.id === expenseIdToEdit);
  }, [expenseIdToEdit, expenses]);

  return (
    <>
      <Stack direction="horizontal" gap={3} className="justify-content-between mb-3">
        <h1>{t('title')}</h1>
        <Button
          variant="secondary"
          className="p-1 rounded-3"
          onClick={() => {
            setExpenseIdToEdit(null);
            setShowCreateOrEditSlideOut(true);
          }}>
          <Plus size={24} />
        </Button>
      </Stack>
      <View
        expenses={expenses}
        onDelete={id => setExpenseIdToDelete(id)}
        onEdit={id => {
          setExpenseIdToEdit(id);
          setShowCreateOrEditSlideOut(true);
        }}
      />
      <CreateOrEditSlideOut
        show={showCreateOrEditSlideOut}
        setShow={setShowCreateOrEditSlideOut}
        expenseToEdit={expenseToEdit}
      />
      <ConfirmationSlideOut
        icon={XCircle}
        show={Boolean(expenseIdToDelete)}
        title={t('delete.title')}
        message={t('delete.message')}
        variant="danger"
        setShow={() => setExpenseIdToDelete(null)}
        onConfirm={() => deleteExpense.mutate(expenseIdToDelete!)}
        confirmLabel={deleteExpense.isPending ? <Spinner size="sm" /> : t('delete.confirm')}
        confirmProps={{ disabled: deleteExpense.isPending }}
      />
    </>
  );
}

export default Expenses;
