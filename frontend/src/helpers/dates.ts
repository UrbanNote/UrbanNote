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

export function formatDateToDisplayString(date: Date | string, language: string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
