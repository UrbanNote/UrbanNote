import classNames from 'classnames';
import type { FormikHelpers } from 'formik';
import { Field, Form, Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import BootstrapForm from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';

import type { GetUserNamesResponse } from '$firebase/auth';
import { ExpenseStatus } from '$firebase/expenses';
import {
  formatDateToDisplayString,
  getMonthDifference,
  getMonthStartAndEnd,
  today,
  userHasExpenseManagement,
} from '$helpers';
import { useAppSelector } from '$store';

import type { FilterFormValues } from './types';

export type FilterProps = {
  assignedToId: string;
  difference: number;
  status: FilterFormValues['status'];
  isVertical?: boolean;
  userNames?: GetUserNamesResponse;
  onSubmit: (values: FilterFormValues, helpers: FormikHelpers<FilterFormValues>) => void;
};

const MONTH_FIRST_DAY = parseInt(`${import.meta.env.VITE_EXPENSES_MONTH_FIRST_DAY || '1'}`);
const MIN_MONTH_DIFFERENCE = Math.max(getMonthDifference(today(), new Date('2024/01/01')), -60); // minimum difference is the closest between 2024/01/01 and 5 years ago
const MAX_MONTH_DIFFERENCE = 0; // we don't want to show future months

function Filters({ assignedToId, difference, status, userNames, isVertical = false, onSubmit }: FilterProps) {
  const { t, i18n } = useTranslation('expenses');
  const user = useAppSelector(state => state.user);
  const hasExpenseManagement = userHasExpenseManagement(user.roles);

  const differenceOptions = Array.from({ length: Math.abs(MAX_MONTH_DIFFERENCE - MIN_MONTH_DIFFERENCE) + 1 }).map(
    (_, i) => {
      const [start, end] = getMonthStartAndEnd(-i, MONTH_FIRST_DAY);
      return {
        value: -i,
        label: `${formatDateToDisplayString(start, i18n.language, { month: 'short' })} - ${formatDateToDisplayString(end, i18n.language, { month: 'short' })}`,
      };
    },
  );

  return (
    <Formik<FilterFormValues>
      initialValues={{
        assignedToId,
        difference,
        status,
      }}
      onSubmit={onSubmit}>
      {() => (
        <Form className={classNames({ 'w-100': isVertical })}>
          <Stack
            direction={isVertical ? 'vertical' : 'horizontal'}
            gap={3}
            className={classNames('mb-3', {
              'align-items-end': !isVertical,
            })}>
            {hasExpenseManagement && userNames?.length && (
              <BootstrapForm.Group controlId="assignedToId" className="mb-0">
                <BootstrapForm.Label>{t('filters.assignedToId')}</BootstrapForm.Label>
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
            <BootstrapForm.Group controlId="difference">
              <BootstrapForm.Label>{t('filters.difference')}</BootstrapForm.Label>
              <Field name="difference" as="select" className="form-select">
                {differenceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="status">
              <BootstrapForm.Label>{t('filters.status.label')}</BootstrapForm.Label>
              <Field name="status" as="select" className="form-select">
                <option value="">{t('filters.status.all')}</option>
                {Object.values(ExpenseStatus).map(status => (
                  <option key={status} value={status}>
                    {t(`status.${status}`)}
                  </option>
                ))}
              </Field>
            </BootstrapForm.Group>
            <Button variant="secondary" type="submit" className={classNames({ 'mt-3': isVertical })}>
              {t('filters.submit')}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default Filters;
