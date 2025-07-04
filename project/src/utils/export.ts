import { Expense } from '../types';
import { formatCurrency } from './currency';

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = [
    'Description',
    'Amount',
    'Category',
    'Date',
    'Paid By',
    'Split Between',
    'Per Person Share'
  ];

  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      `"${expense.description}"`,
      expense.amount,
      expense.category,
      expense.date,
      `"${expense.paidBy}"`,
      `"${expense.splitBetween.join(', ')}"`,
      expense.perPersonShare
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};