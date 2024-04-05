import { useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import type { FormikHelpers, FormikState } from 'formik';
import { Formik } from 'formik';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { SlideOut } from '$components';
import type { GetUserNamesResponse } from '$firebase/auth';
import type { CreateExpenseData, UpdateExpenseData, ExpenseDetails } from '$firebase/expenses';
import { ExpenseCategories } from '$firebase/expenses';
import { createExpense, updateExpense } from '$firebase/expenses';
import { deleteFile } from '$firebase/storage';
import { formatDateToString, isFirebaseError, today } from '$helpers';
import { useAlerts } from '$hooks';
import { useAppSelector } from '$store';

import Form from './Form';

type CreateOrEditSlideOutProps = {
  show: boolean;
  userNames?: GetUserNamesResponse;
  expenseToEdit?: ExpenseDetails;
  assignedToId?: string;
  setShow: (show: boolean) => void;
  onSubmit?: () => void;
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

const getEmptyValues = (assignedToId: string): CreateOrEditExpenseFormValues => ({
  assignedToId,
  title: '',
  description: '',
  date: today(),
  amount: 0,
  pictureURL: [],
  category: ExpenseCategories.TRAVEL,
});

// TODO: can't edit if older than 1 year
function CreateOrEditSlideOut({
  show,
  userNames,
  assignedToId,
  expenseToEdit,
  setShow,
  onSubmit,
}: CreateOrEditSlideOutProps) {
  const { t } = useTranslation('expenses');
  const userId = useAppSelector(state => state.user.id);
  const [isUploading, setIsUploading] = useState(false);
  const alert = useAlerts();
  const [uploadedPictures, setUploadedPictures] = useState<string[]>([]);
  const [ExpenseToEditchanged, setExpenseToEditchanged] = useState(0); //pour que le useMemo de initialValues soit recalculé

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
      const pictureToDelete = uploadedPictures.filter(picture => !values.pictureURL.includes(picture));
      setUploadedPictures([]);
      deleteFile(pictureToDelete);
      alert(t(`${mode}.success`), 'success');
      onSubmit?.();
      setShow(false);
      helpers.resetForm();
      setExpenseToEditchanged(oldSubmit => oldSubmit + 1);
    } catch (error) {
      if (isFirebaseError(error)) {
        return alert(t(`${mode}.errors.${error.message}`), 'danger');
      }

      alert(t(`${mode}.errors.unexpected`), 'danger');
    }
  };

  const handlePictureUploaded = (pictureURL: string) => {
    setUploadedPictures([...uploadedPictures, pictureURL]);
  };

  const createOrEditExpenseSchema = Yup.object({
    title: Yup.string().required(t('createOrEdit.fields.title.required')),
    description: Yup.string(),
    date: Yup.date().required(t('createOrEdit.fields.date.required')),
    amount: Yup.number()
      .required(t('createOrEdit.fields.amount.required'))
      .min(0.01, t('createOrEdit.fields.amount.min'))
      .max(100000, t('createOrEdit.fields.amount.max')),
  });

  const initialValues = useMemo(
    () =>
      expenseToEdit
        ? {
            assignedToId: expenseToEdit.assignedToId || userId!,
            title: expenseToEdit.title || '',
            description: expenseToEdit.description || '',
            date: new Date(expenseToEdit.date),
            amount: expenseToEdit.amount || 0,
            pictureURL: expenseToEdit.pictureURL ? [...expenseToEdit.pictureURL] : [],
            category: expenseToEdit.category,
          }
        : getEmptyValues(assignedToId || userId!),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, assignedToId, expenseToEdit, ExpenseToEditchanged],
  );

  const handleCancel = (
    resetForm: (nextState?: Partial<FormikState<CreateOrEditExpenseFormValues>> | undefined) => void,
    userId: string,
  ) => {
    const pictureToDelete = uploadedPictures.filter(picture => !expenseToEdit?.pictureURL?.includes(picture));
    resetForm({ values: getEmptyValues(userId) });
    setUploadedPictures([]);
    setExpenseToEditchanged(oldCancel => oldCancel + 1);
    if (pictureToDelete.length > 0) {
      deleteFile(pictureToDelete);
    }
  };

  return (
    <Formik<CreateOrEditExpenseFormValues>
      initialValues={initialValues}
      validationSchema={createOrEditExpenseSchema}
      onSubmit={handleSubmit}>
      {({ isValid, dirty, isSubmitting, handleSubmit, resetForm }) => (
        <SlideOut show={show} setShow={setShow} onCancel={() => handleCancel(resetForm, userId!)}>
          <SlideOut.Header title={t(`${mode}.title`)} closeBtn />
          <SlideOut.Body>
            <Form
              userNames={userNames}
              assignedToId={assignedToId}
              expenseToEdit={expenseToEdit}
              initialValues={initialValues}
              setIsUploading={setIsUploading}
              onPictureUploaded={handlePictureUploaded}
            />
          </SlideOut.Body>
          <SlideOut.Footer
            confirmLabel={isSubmitting ? <Spinner size="sm" /> : t(`${mode}.confirm`)}
            confirmProps={{
              disabled: isUploading || isSubmitting || !isValid || !dirty,
              onClick: handleSubmit,
            }}
          />
        </SlideOut>
      )}
    </Formik>
  );
}

export default CreateOrEditSlideOut;
