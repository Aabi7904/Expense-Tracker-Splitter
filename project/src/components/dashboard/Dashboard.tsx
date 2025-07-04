import React, { useState, useEffect, useMemo } from 'react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { Expense, FilterOptions } from '../../types';
import { calculateBalances } from '../../utils/calculations';
import { exportToCSV } from '../../utils/export';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import BalanceSummary from './BalanceSummary';
import ExpenseCharts from './ExpenseCharts';
import ExpenseFilters from './ExpenseFilters';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: '', end: '' },
    category: 'All',
    person: '',
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem(`expenses_${user?.id}`);
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, [user]);

  useEffect(() => {
    // Save expenses to localStorage
    localStorage.setItem(`expenses_${user?.id}`, JSON.stringify(expenses));
  }, [expenses, user]);

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    setShowClearConfirm(false);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Date range filter
      if (filters.dateRange.start && expense.date < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && expense.date > filters.dateRange.end) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'All' && expense.category !== filters.category) {
        return false;
      }
      
      // Person filter
      if (filters.person && expense.paidBy !== filters.person && !expense.splitBetween.includes(filters.person)) {
        return false;
      }
      
      return true;
    });
  }, [expenses, filters]);

  const balances = useMemo(() => calculateBalances(filteredExpenses), [filteredExpenses]);

  const availablePersons = useMemo(() => {
    const persons = new Set<string>();
    expenses.forEach(expense => {
      persons.add(expense.paidBy);
      expense.splitBetween.forEach(person => persons.add(person));
    });
    return Array.from(persons).sort();
  }, [expenses]);

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    exportToCSV(filteredExpenses);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and split your expenses effortlessly
          </p>
        </div>

        <div className="space-y-8">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Expense Form */}
          <ExpenseForm onAddExpense={addExpense} />

          {/* Filters */}
          <ExpenseFilters
            filters={filters}
            onFiltersChange={setFilters}
            availablePersons={availablePersons}
          />

          {/* Charts */}
          <ExpenseCharts expenses={filteredExpenses} />

          {/* Balance Summary and Expense Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <BalanceSummary balances={balances} />
            </div>
            <div className="lg:col-span-2">
              <ExpenseTable expenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clear All Expenses
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to clear all expenses? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={clearAllExpenses}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;