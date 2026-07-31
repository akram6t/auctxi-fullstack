import { useState, useEffect } from 'react';
import ManagerLedger from './components/ManagerLedger';
import { IconDownload } from '@tabler/icons-react';
import { useSettings } from '../../../context/SettingsContext';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const Payments = () => {
  const { currencySymbol } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/payments');
        setTransactions(res.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load ledger transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const successfulTxs = transactions.filter(t => t.status && t.status.toLowerCase() === 'success');
  const totalSpent = successfulTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  
  const teamSpends = successfulTxs.reduce((acc, tx) => {
    if (tx.teamName) {
        acc[tx.teamName] = (acc[tx.teamName] || 0) + (tx.amount || 0);
    }
    return acc;
  }, {});
  
  let highestSpendTeam = '-';
  let highestAmount = 0;
  Object.entries(teamSpends).forEach(([team, amount]) => {
      if (amount > highestAmount) {
          highestAmount = amount;
          highestSpendTeam = team;
      }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Auction Ledger
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Read-only ledger of team spends for your assigned events.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-colors">
            <IconDownload size={18} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Spent</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '-' : `${currencySymbol}${totalSpent.toLocaleString()}`}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Highest Spend (Team)</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '-' : highestSpendTeam}</dd>
        </div>
      </div>

      <ManagerLedger transactions={transactions} loading={loading} />
    </div>
  );
};

export default Payments;
