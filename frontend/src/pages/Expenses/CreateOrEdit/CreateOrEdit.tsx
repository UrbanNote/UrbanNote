import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import type { FormikHelpers } from 'formik';
import { Formik } from 'formik';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { SlideOut } from '$components';
import type { CreateExpenseData, ExpenseDetails, UpdateExpenseData } from '$firebase/expenses';
import { ExpenseCategories } from '$firebase/expenses';
import { createExpense, updateExpense } from '$firebase/expenses';
import { formatDateToString, isFirebaseError, today } from '$helpers';
import { useAlerts } from '$hooks';
import { useAppSelector } from '$store';

import Form from './Form';

type CreateOrEditSlideOutProps = {
  show: boolean;
  onSubmit?: () => void;
  setShow: (show: boolean) => void;
  expenseToEdit?: ExpenseDetails;
};

export type CreateOrEditExpenseFormValues = {
  assignedToId: string;
  title: string;
  description: string;
  date: Date;
  amount: number;
  pictureURL: string[];
  category: ExpenseCategories;
};

// TODO: can't edit if older than 1 year
// TODO: when cancelling, delete the pictures that were uploaded but not used
function CreateOrEditSlideOut({ show, expenseToEdit, onSubmit, setShow }: CreateOrEditSlideOutProps) {
  const { t } = useTranslation('expenses');
  const userId = useAppSelector(state => state.user.id);
  const [isUploading, setIsUploading] = useState(false);
  const alert = useAlerts();

  const mode = expenseToEdit ? 'edit' : 'create';

  const createExpenseMutation = useMutation({
    mutationFn: async (values: CreateExpenseData) => createExpense(values),
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async (data: UpdateExpenseData) => updateExpense(data),
  });

  const handleSubmit = async (
    values: CreateOrEditExpenseFormValues,
    helpers: FormikHelpers<CreateOrEditExpenseFormValues>,
  ) => {
    try {
      const { date, ...rest } = values;
      if (mode === 'create') {
        await createExpenseMutation.mutateAsync({ ...rest, date: formatDateToString(date) });
      } else {
        await updateExpenseMutation.mutateAsync({
          expenseId: expenseToEdit!.id,
          updates: { ...rest, date: formatDateToString(date) },
        });
      }

      alert(t(`${mode}.success`), 'success');
      onSubmit?.();
      setShow(false);
      helpers.resetForm();
    } catch (error) {
      if (isFirebaseError(error)) {
        return alert(t(`${mode}.errors.${error.message}`), 'danger');
      }

      alert(t(`${mode}.errors.unexpected`), 'danger');
    }
  };

  const createOrEditExpenseSchema = Yup.object({
    title: Yup.string().required(t('createOrEdit.fields.title.required')),
    description: Yup.string(),
    date: Yup.date().required(t('createOrEdit.fields.date.required')),
    amount: Yup.number()
      .required(t('createOrEdit.fields.amount.required'))
      .min(0.01, t('createOrEdit.fields.amount.min')),
  });

  const emptyValues: CreateOrEditExpenseFormValues = {
    assignedToId: userId!,
    title: '',
    description: '',
    date: today(),
    amount: 0,
    pictureURL: [],
    category: ExpenseCategories.TRAVEL,
  };

  const initialValues: CreateOrEditExpenseFormValues = {
    assignedToId: expenseToEdit?.assignedToId || userId!,
    title: expenseToEdit?.title || '',
    description: expenseToEdit?.description || '',
    date: expenseToEdit ? new Date(expenseToEdit.date) : today(),
    amount: expenseToEdit?.amount || 0,
    pictureURL: expenseToEdit?.pictureURL || [],
    category: expenseToEdit?.category || ExpenseCategories.TRAVEL,
  };

  return (
    <Formik<CreateOrEditExpenseFormValues>
      initialValues={initialValues}
      validationSchema={createOrEditExpenseSchema}
      onSubmit={handleSubmit}>
      {({ errors, isSubmitting, handleSubmit, resetForm }) => (
        <SlideOut show={show} setShow={setShow} onCancel={() => resetForm({ values: emptyValues })}>
          <SlideOut.Header title={t(`${mode}.title`)} closeBtn />
          <SlideOut.Body>
            <Form expenseToEdit={expenseToEdit} setIsUploading={setIsUploading} />
          </SlideOut.Body>
          <SlideOut.Footer
            confirmLabel={isSubmitting ? <Spinner size="sm" /> : t(`${mode}.confirm`)}
            confirmProps={{ disabled: isUploading || isSubmitting || Boolean(errors.amount), onClick: handleSubmit }}
          />
        </SlideOut>
      )}
    </Formik>
  );
}

export default CreateOrEditSlideOut;
