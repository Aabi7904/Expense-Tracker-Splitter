import { Expense, Balance } from '../types';

export const calculatePerPersonShare = (amount: number, splitBetween: string[]): number => {
  return splitBetween.length > 0 ? amount / splitBetween.length : 0;
};

export const calculateBalances = (expenses: Expense[]): Balance[] => {
  const balanceMap = new Map<string, Balance>();

  expenses.forEach(expense => {
    // Initialize people if not exists
    if (!balanceMap.has(expense.paidBy)) {
      balanceMap.set(expense.paidBy, {
        person: expense.paidBy,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0
      });
    }

    expense.splitBetween.forEach(person => {
      if (!balanceMap.has(person)) {
        balanceMap.set(person, {
          person,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0
        });
      }
    });

    // Update paid amount
    const paidByBalance = balanceMap.get(expense.paidBy)!;
    paidByBalance.totalPaid += expense.amount;

    // Update owed amounts
    expense.splitBetween.forEach(person => {
      const personBalance = balanceMap.get(person)!;
      personBalance.totalOwed += expense.perPersonShare;
    });
  });

  // Calculate net balances
  balanceMap.forEach(balance => {
    balance.netBalance = balance.totalPaid - balance.totalOwed;
  });

  return Array.from(balanceMap.values()).sort((a, b) => b.netBalance - a.netBalance);
};

export const getExpensesByCategory = (expenses: Expense[]) => {
  const categoryTotals = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = categoryTotals.get(expense.category) || 0;
    categoryTotals.set(expense.category, current + expense.amount);
  });

  return Array.from(categoryTotals.entries()).map(([category, total]) => ({
    category,
    total
  }));
};

export const getExpensesByPerson = (expenses: Expense[]) => {
  const personTotals = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = personTotals.get(expense.paidBy) || 0;
    personTotals.set(expense.paidBy, current + expense.amount);
  });

  return Array.from(personTotals.entries()).map(([person, total]) => ({
    person,
    total
  }));
};