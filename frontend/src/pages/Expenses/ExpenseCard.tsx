import { useState } from 'react';

import { Spinner, type BadgeProps } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Stack from 'react-bootstrap/Stack';
import {
  Archive,
  BoxArrowUp,
  CalendarCheck,
  Cash,
  CheckCircle,
  Image,
  PencilFill,
  Tag,
  ThreeDots,
  Trash,
  XCircle,
} from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { ExpenseStatus } from '$firebase/expenses';
import type { ExpenseDetails } from '$firebase/expenses';
import { formatCurrency, formatDateToDisplayString, userHasExpenseManagement } from '$helpers';
import { useAppSelector } from '$store';

type ExpenseCardProps = {
  expense: ExpenseDetails;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => Promise<void>;
  onClickViewPictures: (id: string) => void;
};

function getStatusBadgeProps(status: ExpenseStatus): Pick<BadgeProps, 'bg'> {
  switch (status) {
    case ExpenseStatus.APPROVED:
      return { bg: 'success' };
    case ExpenseStatus.ARCHIVED:
      return { bg: 'info' };
    case ExpenseStatus.PENDING:
      return { bg: 'warning' };
    case ExpenseStatus.REJECTED:
      return { bg: 'danger' };
    default:
      return { bg: 'dark' };
  }
}

function ExpenseCard({ expense, onEdit, onDelete, onStatusChange, onClickViewPictures }: ExpenseCardProps) {
  const { t, i18n } = useTranslation('expenses');
  const user = useAppSelector(state => state.user);
  const hasExpenseManagement = userHasExpenseManagement(user.roles);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (id: string, status: ExpenseStatus) => {
    setIsLoading(true);
    await onStatusChange(id, status);
    setIsLoading(false);
  };

  return (
    <Card className={styles.card}>
      <Stack direction="horizontal" gap={3} className={styles.header}>
        <Stack direction="horizontal" gap={2} className={styles.titleWrapper}>
          <h2 className={styles.title}>{expense.title}</h2>
          <Badge {...getStatusBadgeProps(expense.status)}>{t(`status.${expense.status}`)}</Badge>
        </Stack>
        <Dropdown>
          {isLoading ? (
            <Spinner size="sm" className="m-1" />
          ) : (
            <Dropdown.Toggle variant="transparent" className={styles.threeDots}>
              <ThreeDots />
            </Dropdown.Toggle>
          )}
          <Dropdown.Menu>
            {hasExpenseManagement && (
              <>
                {(expense.status === ExpenseStatus.PENDING || expense.status === ExpenseStatus.REJECTED) && (
                  <Dropdown.Item
                    onClick={() => handleStatusChange(expense.id, ExpenseStatus.APPROVED)}
                    className={styles.action}>
                    <CheckCircle className={styles.icon} /> {t('actions.approve')}
                  </Dropdown.Item>
                )}
                {(expense.status === ExpenseStatus.PENDING || expense.status === ExpenseStatus.APPROVED) && (
                  <Dropdown.Item
                    onClick={() => handleStatusChange(expense.id, ExpenseStatus.REJECTED)}
                    className={styles.action}>
                    <XCircle className={styles.icon} /> {t('actions.reject')}
                  </Dropdown.Item>
                )}
                {expense.status !== ExpenseStatus.ARCHIVED && (
                  <Dropdown.Item
                    onClick={() => handleStatusChange(expense.id, ExpenseStatus.ARCHIVED)}
                    className={styles.action}>
                    <Archive className={styles.icon} /> {t('actions.archive')}
                  </Dropdown.Item>
                )}
                {expense.status === ExpenseStatus.ARCHIVED && (
                  <Dropdown.Item
                    onClick={() => handleStatusChange(expense.id, ExpenseStatus.PENDING)}
                    className={styles.action}>
                    <BoxArrowUp className={styles.icon} /> {t('actions.restore')}
                  </Dropdown.Item>
                )}
                <hr />
              </>
            )}
            <Dropdown.Item onClick={() => onEdit(expense.id)} className={styles.action}>
              <PencilFill className={styles.icon} /> {t('actions.edit')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(expense.id)} className={styles.action}>
              <Trash className={styles.icon} /> {t('actions.delete')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
      <div className={styles.property}>
        <Tag className={styles.icon} />
        {t(`categories.${expense.category}`)}
      </div>
      <div className={styles.property}>
        <CalendarCheck className={styles.icon} />
        {formatDateToDisplayString(expense.date, i18n.language)}
      </div>
      <div className={styles.property}>
        <Cash className={styles.icon} />
        {formatCurrency(expense.amount, i18n.language)}
      </div>
      <div className={styles.property}>
        <Image className={styles.icon} />
        {expense.pictureURL?.length ? (
          <Button variant="link" className="p-0" onClick={() => onClickViewPictures(expense.id)}>
            {expense.pictureURL.length} {expense.pictureURL.length === 1 ? t('picture') : t('pictures')}
          </Button>
        ) : (
          `0 ${t('pictures')}`
        )}
      </div>
    </Card>
  );
}

const styles = {
  action: 'd-flex flex-row align-items-center gap-2',
  card: 'ExpenseCard border-0 rounded-4 p-3 shadow-sm',
  header: 'justify-content-between align-items-start',
  icon: 'text-primary',
  property: 'd-flex flex-row align-items-center gap-2',
  threeDots: 'py-0 px-1 rounded-circle dropdown-toggle-highlight',
  title: 'h5 text-break mb-0',
  titleWrapper: 'align-items-center mb-2',
};

export default ExpenseCard;
