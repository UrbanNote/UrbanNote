// import type { BadgeProps } from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Stack from 'react-bootstrap/Stack';
import { CalendarCheck, Cash, Image, PencilFill, Tag, ThreeDots } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

// import { ExpenseStatus } from '$firebase/expenses';
import type { ExpenseDetails } from '$firebase/expenses';
import { formatCurrency, formatDateToDisplayString } from '$helpers';

type ExpenseCardProps = {
  expense: ExpenseDetails;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

/*
TODO: add badge when expense management is added
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
*/

function ExpenseCard({ expense, onEdit }: ExpenseCardProps) {
  const { t, i18n } = useTranslation('expenses');

  return (
    <Card className="ExpenseCard border-0 rounded-4 p-3 shadow-sm">
      <Stack direction="horizontal" gap={3} className="justify-content-between align-items-start">
        <Stack direction="horizontal" gap={2} className="align-items-center">
          <h2 className="h5 mb-2">{expense.title}</h2>
          {/* <Badge {...getStatusBadgeProps(expense.status)}>{t(`status.${expense.status}`)}</Badge> */}
        </Stack>
        <Dropdown>
          <Dropdown.Toggle variant="transparent" className="py-0 px-1 rounded-circle">
            <ThreeDots />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onEdit(expense.id)} className="d-flex flex-row align-items-center gap-2">
              <PencilFill className="text-primary" /> {t('actions.edit')}
            </Dropdown.Item>
            {/* <Dropdown.Item onClick={() => onDelete(expense.id)} disabled>
              {t('actions.delete')}
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
      <div className="d-flex flex-row align-items-center gap-2">
        <Tag className="text-primary" />
        {t(`categories.${expense.category}`)}
      </div>
      <div className="d-flex flex-row align-items-center gap-2">
        <CalendarCheck className="text-primary" />
        {formatDateToDisplayString(expense.date, i18n.language)}
      </div>
      <div className="d-flex flex-row align-items-center gap-2">
        <Cash className="text-primary" />
        {formatCurrency(expense.amount, i18n.language)}
      </div>
      <div className="d-flex flex-row align-items-center gap-2">
        <Image className="text-primary" />
        {expense.pictureURL?.length || 0} {expense.pictureURL?.length === 1 ? t('picture') : t('pictures')}
      </div>
    </Card>
  );
}

export default ExpenseCard;
