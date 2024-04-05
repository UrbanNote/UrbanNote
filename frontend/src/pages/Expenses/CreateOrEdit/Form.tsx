import { useEffect } from 'react';

import { ErrorMessage, Field, Form as FormikForm, useFormikContext } from 'formik';
import BootstrapForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';

import { DateField, PicturesField } from '$components';
import { ExpenseCategories, type ExpenseDetails } from '$firebase/expenses';
import { today } from '$helpers';
import { useAppSelector } from '$store';

import type { CreateOrEditExpenseFormValues } from './CreateOrEdit';

type FormProps = {
  expenseToEdit?: ExpenseDetails;
  setIsUploading: (isUploading: boolean) => void;
};

function Form({ expenseToEdit, setIsUploading }: FormProps) {
  const { t } = useTranslation('expenses');
  const { errors, resetForm, setValues } = useFormikContext<CreateOrEditExpenseFormValues>();
  const user = useAppSelector(state => state.user);

  useEffect(
    () =>
      resetForm({
        values: {
          assignedToId: expenseToEdit?.assignedToId || user.id!,
          title: expenseToEdit?.title || '',
          description: expenseToEdit?.description || '',
          date: expenseToEdit ? new Date(expenseToEdit.date) : today(),
          amount: expenseToEdit?.amount || 0,
          pictureURL: expenseToEdit?.pictureURL || [],
          category: expenseToEdit?.category || ExpenseCategories.TRAVEL,
        },
      }),
    [expenseToEdit, user.id, resetForm, setValues],
  );

  return (
    <FormikForm className="w-100">
      <BootstrapForm.Group className="mb-3" controlId="title">
        <BootstrapForm.Label>
          {t('createOrEdit.fields.title.label')}
          <span className="text-danger">*</span>
        </BootstrapForm.Label>
        <Field
          as={BootstrapForm.Control}
          name="title"
          type="text"
          placeholder={t('createOrEdit.fields.title.placeholder')}
        />
        <ErrorMessage name="title" component="div" className="text-danger" />
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb-3" controlId="description">
        <BootstrapForm.Label>{t('createOrEdit.fields.description.label')}</BootstrapForm.Label>
        <Field
          as="textarea"
          id="description"
          className="form-control"
          name="description"
          cols={3}
          placeholder={t('createOrEdit.fields.description.placeholder')}
        />
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb-3" controlId="category">
        <BootstrapForm.Label>
          {t('createOrEdit.fields.category.label')}
          <span className="text-danger">*</span>
        </BootstrapForm.Label>
        <Field as="select" name="category" className="form-select">
          {Object.values(ExpenseCategories).map(category => (
            <option key={category} value={category}>
              {t(`categories.${category}`)}
            </option>
          ))}
        </Field>
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb-3 w-100" controlId="date">
        <BootstrapForm.Label>
          {t('createOrEdit.fields.date.label')}
          <span className="text-danger">*</span>
        </BootstrapForm.Label>
        <DateField max={new Date()} name="date" isInvalid={Boolean(errors.date)} />
        <ErrorMessage name="date" component="div" className="text-danger" />
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb-3 w-100" controlId="amount">
        <BootstrapForm.Label>
          {t('createOrEdit.fields.amount.label')}
          <span className="text-danger">*</span>
        </BootstrapForm.Label>
        <InputGroup>
          <Field as={BootstrapForm.Control} name="amount" type="number" step="0.01" />
          <InputGroup.Text className="bg-transparent text-gray">$</InputGroup.Text>
        </InputGroup>
        <ErrorMessage name="amount" component="div" className="text-danger" />
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb3 w-100" controlId="pictureURL">
        <BootstrapForm.Label>{t('createOrEdit.fields.pictureURL.label')}</BootstrapForm.Label>
        <PicturesField
          name="pictureURL"
          uploadPath={`expenses/${new Date().getFullYear()}`}
          setIsUploading={setIsUploading}
          hideWhenNotEmpty={Boolean(expenseToEdit)}
        />
      </BootstrapForm.Group>
    </FormikForm>
  );
}

export default Form;
