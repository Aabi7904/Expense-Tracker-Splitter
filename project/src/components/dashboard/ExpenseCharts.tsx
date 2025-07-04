import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Expense } from '../../types';
import { getExpensesByCategory, getExpensesByPerson } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { PieChart, BarChart3 } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ExpenseChartsProps {
  expenses: Expense[];
}

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
  const categoryData = getExpensesByCategory(expenses);
  const personData = getExpensesByPerson(expenses);

  const pieData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.total),
        backgroundColor: [
          '#10B981', // Green for Food
          '#3B82F6', // Blue for Travel
          '#8B5CF6', // Purple for Shopping
          '#F59E0B', // Yellow for Utilities
          '#6B7280', // Gray for Other
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#7C3AED',
          '#D97706',
          '#4B5563',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: personData.map(item => item.person),
    datasets: [
      {
        label: 'Total Expenses',
        data: personData.map(item => item.total),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Expenses by Category
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No data available
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Expenses by Person
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No data available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Expenses by Category
        </h3>
        <div className="h-64">
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Expenses by Person
        </h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;