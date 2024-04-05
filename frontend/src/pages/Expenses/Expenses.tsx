import { useMemo, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import type { FormikHelpers } from 'formik';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { Filter, Plus, XCircle } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ConfirmationSlideOut } from '$components';
import { getUserNames } from '$firebase/auth';
import type { ExpenseStatus } from '$firebase/expenses';
import { deleteExpense, updateExpenseStatus } from '$firebase/expenses';
import { isFirebaseError, userHasExpenseManagement } from '$helpers';
import { useAlerts, useAppLayout, usePageDetails, useScreenMinWidth } from '$hooks';
import { useAppSelector } from '$store';

import CreateOrEditSlideOut from './CreateOrEdit';
import Filters from './Filters';
import FiltersSlideOut from './FiltersSlideOut';
import PicturesModal from './PicturesModal';
import type { FilterFormValues } from './types';
import useExpenses from './useExpenses';
import View from './View';

import './Expenses.scss';

function Expenses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppSelector(state => state.user);
  const alert = useAlerts();
  const { t } = useTranslation('expenses');
  const isLayoutHorizontal = useAppLayout('horizontal');
  const isAboveMdBreakpoint = useScreenMinWidth('md');
  usePageDetails({
    title: t('title'),
    background: isLayoutHorizontal ? 'beige' : 'transparent',
  });

  const hasExpenseManagement = userHasExpenseManagement(user.roles);

  const [showCreateOrEditSlideOut, setShowCreateOrEditSlideOut] = useState(false);
  const [showFiltersSlideOut, setShowFiltersSlideOut] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState<string | null>(null);
  const [expenseIdToEdit, setExpenseIdToEdit] = useState<string | null>(null);
  const [expenseIdToViewPictures, setExpenseIdToViewPictures] = useState<string | null>(null);

  const expenses = useExpenses({
    difference: searchParams.has('difference') ? parseInt(searchParams.get('difference')!) : 0,
    status: searchParams.get('status') as ExpenseStatus | null,
    userId:
      hasExpenseManagement && searchParams.has('assignedToId')
        ? searchParams.get('assignedToId') ?? user.id!
        : user.id!,
  });

  const { data: userNames } = useQuery({
    enabled: hasExpenseManagement,
    queryKey: ['userNames'],
    queryFn: async () => {
      const data = await getUserNames();
      return data.sort((a, b) => {
        if (a.id === user.id) return -1;
        return a.name.localeCompare(b.name);
      });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationKey: ['deleteExpense'],
    mutationFn: async () => {
      try {
        await deleteExpense(expenseIdToDelete!);
        setExpenseIdToDelete(null);
        alert(t('delete.success'), 'success');
      } catch (error) {
        alert('delete.errors.unexpected', 'danger');
      }
    },
  });

  const updateExpenseStatusMutation = useMutation({
    mutationKey: ['updateExpenseStatus'],
    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
    mutationFn: async ({ expenseId, status }: { expenseId: string; status: ExpenseStatus }) => {
      try {
        await updateExpenseStatus({ expenseId, status });
        alert(t(`updateStatus.success.${status}`), 'success');
      } catch (error) {
        if (isFirebaseError(error)) {
          const supportedErrors = ['expenseNotFound', 'permissionDenied', 'unexpected'];
          if (supportedErrors.includes(error.message)) {
            alert(`updateStatus.errors.${error.message}`, 'danger');
            return;
          }
        }

        alert('updateStatus.errors.unexpected', 'danger');
      }
    },
  });

  const handleStatusChange = (expenseId: string, status: ExpenseStatus) =>
    updateExpenseStatusMutation.mutateAsync({ expenseId, status });

  const expenseToEdit = useMemo(() => {
    if (!expenseIdToEdit || !expenses.data || !expenses.data.length) return undefined;
    return expenses.data.find(expense => expense.id === expenseIdToEdit);
  }, [expenseIdToEdit, expenses]);

  const expenseToViewPictures = useMemo(() => {
    if (!expenseIdToViewPictures || !expenses.data || !expenses.data.length) return undefined;
    return expenses.data.find(expense => expense.id === expenseIdToViewPictures);
  }, [expenseIdToViewPictures, expenses]);

  const handleSubmitFilters = (values: FilterFormValues, helpers: FormikHelpers<FilterFormValues>) => {
    if (hasExpenseManagement) {
      searchParams.set('assignedToId', values.assignedToId);
    } else {
      searchParams.delete('assignedToId');
      helpers.setFieldValue('assignedToId', values.assignedToId);
    }

    searchParams.set('difference', values.difference.toString());
    searchParams.set('status', values.status);
    setSearchParams(searchParams);
  };

  const setShowSlideOut = (show: boolean) => {
    setShowCreateOrEditSlideOut(show);
    // Delay setting the expense to edit to null to allow the slide out to close
    if (!show) setTimeout(() => setExpenseIdToEdit(null), 600);
  };

  const isMe =
    !hasExpenseManagement || !searchParams.has('assignedToId') || user.id === searchParams.get('assignedToId');

  return (
    <>
      <Stack direction="horizontal" gap={3} className="justify-content-between mb-3">
        <h1>{t('title')}</h1>
        <Stack direction="horizontal" gap={2}>
          {!isAboveMdBreakpoint && (
            <Button
              variant="primary"
              className="p-1 rounded-3"
              onClick={() => {
                setShowFiltersSlideOut(true);
              }}>
              <Filter size={24} />
            </Button>
          )}
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
      </Stack>
      {isAboveMdBreakpoint && (
        <Filters
          userNames={userNames}
          assignedToId={searchParams.get('assignedToId') || user.id!}
          difference={searchParams.get('difference') ? parseInt(searchParams.get('difference')!) : 0}
          status={(searchParams.get('status') || '') as FilterFormValues['status']}
          onSubmit={handleSubmitFilters}
        />
      )}
      <View
        isMe={isMe}
        expenses={expenses}
        onDelete={id => setExpenseIdToDelete(id)}
        onEdit={id => {
          setExpenseIdToEdit(id);
          setShowCreateOrEditSlideOut(true);
        }}
        onStatusChange={handleStatusChange}
        onClickViewPictures={setExpenseIdToViewPictures}
      />
      <CreateOrEditSlideOut
        show={showCreateOrEditSlideOut}
        setShow={setShowSlideOut}
        userNames={userNames}
        expenseToEdit={expenseToEdit}
        assignedToId={!isMe ? searchParams.get('assignedToId') || undefined : undefined}
      />
      <ConfirmationSlideOut
        icon={XCircle}
        show={Boolean(expenseIdToDelete)}
        title={t('delete.title')}
        message={t('delete.message')}
        variant="danger"
        setShow={() => setExpenseIdToDelete(null)}
        onConfirm={deleteExpenseMutation.mutate}
        confirmLabel={deleteExpenseMutation.isPending ? <Spinner size="sm" /> : t('delete.confirm')}
        confirmProps={{ disabled: deleteExpenseMutation.isPending }}
      />
      {!isAboveMdBreakpoint && (
        <FiltersSlideOut
          show={showFiltersSlideOut}
          setShow={setShowFiltersSlideOut}
          assignedToId={searchParams.get('assignedToId') || user.id!}
          difference={searchParams.get('difference') ? parseInt(searchParams.get('difference')!) : 0}
          status={(searchParams.get('status') ?? 'all') as FilterFormValues['status']}
          onSubmit={handleSubmitFilters}
        />
      )}
      <PicturesModal
        expense={expenseToViewPictures}
        show={Boolean(expenseToViewPictures)}
        onHide={() => setExpenseIdToViewPictures(null)}
      />
    </>
  );
}

export default Expenses;
