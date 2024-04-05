// TODO: support other currency than CAD
export function formatCurrency(amount: number, language: string) {
  const formatter = new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'CAD',
  });

  return formatter.format(amount);
}
