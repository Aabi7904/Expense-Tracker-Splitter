import React from 'react';
import { Balance } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';

interface BalanceSummaryProps {
  balances: Balance[];
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ balances }) => {
  if (balances.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Balance Summary
        </h2>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No balance data available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Users className="h-5 w-5 mr-2" />
        Balance Summary
      </h2>
      
      <div className="space-y-4">
        {balances.map((balance) => (
          <div
            key={balance.person}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {balance.person}
              </h3>
              <div className="flex items-center space-x-2">
                {balance.netBalance > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : balance.netBalance < 0 ? (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                ) : (
                  <Minus className="h-5 w-5 text-gray-400" />
                )}
                <span
                  className={`text-lg font-semibold ${
                    balance.netBalance > 0
                      ? 'text-green-600 dark:text-green-400'
                      : balance.netBalance < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {formatCurrency(Math.abs(balance.netBalance))}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                <div className="text-blue-600 dark:text-blue-400 font-medium">Total Paid</div>
                <div className="text-blue-800 dark:text-blue-300 font-semibold">
                  {formatCurrency(balance.totalPaid)}
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-md p-3">
                <div className="text-orange-600 dark:text-orange-400 font-medium">Total Owes</div>
                <div className="text-orange-800 dark:text-orange-300 font-semibold">
                  {formatCurrency(balance.totalOwed)}
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {balance.netBalance > 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Should receive {formatCurrency(balance.netBalance)}
                  </span>
                ) : balance.netBalance < 0 ? (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Should pay {formatCurrency(Math.abs(balance.netBalance))}
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    All settled up
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceSummary;