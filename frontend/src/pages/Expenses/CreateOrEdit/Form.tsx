import { useEffect, useState } from 'react';

import { ErrorMessage, Field, Form as FormikForm, useFormikContext } from 'formik';
import BootstrapForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';

import { DateField, PicturesField } from '$components';
import type { GetUserNamesResponse } from '$firebase/auth';
import { ExpenseCategories, type ExpenseDetails } from '$firebase/expenses';
import { userHasExpenseManagement } from '$helpers';
import { useAppSelector } from '$store';

import type { CreateOrEditExpenseFormValues } from './CreateOrEdit';

import '../Expenses.scss';

type FormProps = {
  userNames?: GetUserNamesResponse;
  assignedToId?: string;
  expenseToEdit?: ExpenseDetails;
  initialValues: CreateOrEditExpenseFormValues;
  setIsUploading: (isUploading: boolean) => void;
  onPictureUploaded?: (pictureURL: string) => void;
};

function Form({ userNames, assignedToId, expenseToEdit, initialValues, setIsUploading, onPictureUploaded }: FormProps) {
  const { t } = useTranslation('expenses');
  const { errors, resetForm, setFieldValue } = useFormikContext<CreateOrEditExpenseFormValues>();
  const [deleteFileButtonClicked, setDeleteFileButtonClicked] = useState(false);
  const user = useAppSelector(state => state.user);
  const hasExpenseManagement = userHasExpenseManagement(user.roles);

  useEffect(() => resetForm({ values: initialValues }), [assignedToId, expenseToEdit, initialValues, resetForm]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputAmount = e.target.value.trim();

    //Permet d'empêcher d'entrer un nombre négatif
    if (inputAmount.includes('-')) {
      inputAmount = inputAmount.replace('-', '');
    }

    const inputParts = inputAmount.split('.');
    const integerPart = inputParts[0];
    let decimalPart = '';

    // S'il y a une partie Decimal
    if (inputParts.length > 1) {
      decimalPart = inputParts[1].slice(0, 2);
    }

    inputAmount = inputParts.length > 1 ? `${integerPart}.${decimalPart || ''}` : integerPart;

    setFieldValue('amount', inputAmount);
  };

  return (
    <FormikForm className="w-100">
      {hasExpenseManagement && userNames?.length && (
        <BootstrapForm.Group controlId="assignedToId" className="mb-3">
          <BootstrapForm.Label>
            {t('createOrEdit.fields.assignedToId.label')}
            <span className="text-danger">*</span>
          </BootstrapForm.Label>
          <Field name="assignedToId" as="select" className="form-select">
            {userNames.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
                {u.id === user.id ? ` (${t('filters.me')})` : ''}
              </option>
            ))}
          </Field>
        </BootstrapForm.Group>
      )}
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
          <Field
            as={BootstrapForm.Control}
            name="amount"
            type="number"
            step="0.01"
            min="0"
            onChange={handleAmountChange}
          />
          <InputGroup.Text className="bg-transparent text-gray">$</InputGroup.Text>
        </InputGroup>
        <ErrorMessage name="amount" component="div" className="text-danger size-error-amount" />
      </BootstrapForm.Group>
      <BootstrapForm.Group className="mb3 w-100" controlId="pictureURL">
        <BootstrapForm.Label>{t('createOrEdit.fields.pictureURL.label')}</BootstrapForm.Label>
        {deleteFileButtonClicked && (
          <span className="d-block text-secondary info__delete__image">{t('createOrEdit.fields.pictureURL.info')}</span>
        )}
        <PicturesField
          name="pictureURL"
          uploadPath={`expenses/${new Date().getFullYear()}`}
          hideWhenNotEmpty={Boolean(expenseToEdit)}
          setIsUploading={setIsUploading}
          onPictureUploaded={onPictureUploaded}
          setDeleteFileButtonClicked={setDeleteFileButtonClicked}
        />
      </BootstrapForm.Group>
    </FormikForm>
  );
}

export default Form;
