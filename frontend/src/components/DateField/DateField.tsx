import { useFormikContext } from 'formik';
import Form from 'react-bootstrap/Form';

import { formatDateToString } from '$helpers';

export type DateFieldProps = {
  min?: Date;
  max?: Date;
  name: string;
  isInvalid: boolean;
};

function DateField<T>({ max, min, name, isInvalid }: DateFieldProps) {
  const { setFieldValue, values } = useFormikContext<T>();

  const value = values[name as keyof typeof values] as Date | null;
  const displayValue = value?.toISOString().split('T')[0] ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldValue(name, value ? new Date(formatDateToString(e.target.value)) : null);
  };

  return (
    <Form.Control
      min={min?.toISOString().split('T')[0]}
      max={max?.toISOString().split('T')[0]}
      name={name}
      type="date"
      value={displayValue}
      onChange={handleChange}
      isInvalid={isInvalid}
    />
  );
}

export default DateField;
