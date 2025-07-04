export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paidBy: string;
  splitBetween: string[];
  perPersonShare: number;
  userId: string;
}

export type ExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Utilities' | 'Other';

export interface Balance {
  person: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  category: ExpenseCategory | 'All';
  person: string;
}