export function formatDateToString(date: Date | string) {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/');
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}/${month}/${day}`;
}

export function today() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDateToDisplayString(
  date: Date | string,
  language: string,
  options: Intl.DateTimeFormatOptions = {},
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString(language, formatOptions);
}

export function getMonthStartAndEnd(difference: number, monthFirstDay: number): [string, string] {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + difference;
  if (monthFirstDay >= date.getDate()) {
    month -= 1;
  }

  const start = new Date(year, month, monthFirstDay);
  const end = new Date(year, month + 1, monthFirstDay);

  return [formatDateToString(start), formatDateToString(end)];
}

export function getMonthDifference(startDate: Date, endDate: Date) {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
}
