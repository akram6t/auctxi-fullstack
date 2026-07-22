import { IconSearch, IconFilter, IconDownload } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import TransactionHistory from './components/TransactionHistory';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/payments');
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        toast.error("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const pendingVolume = transactions.filter(t => t.status?.toLowerCase() === 'pending').reduce((acc, t) => acc + (t.amount || 0), 0);
  const successfulTxns = transactions.filter(t => t.status?.toLowerCase() === 'completed').length;
  const totalTxns = transactions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Payments & Ledger
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Monitor entry fees, player purchases, and wallet top-ups.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => toast.info('Exporting ledger as CSV...')}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-colors"
          >
            <IconDownload size={18} className="mr-2" />
            Export Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Processed Volume</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '...' : `$${totalVolume.toLocaleString()}`}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Pending Transactions</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600">{loading ? '...' : `$${pendingVolume.toLocaleString()}`}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Successful Transactions</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '...' : `${successfulTxns} / ${totalTxns}`}</dd>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg leading-5 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            placeholder="Search by Transaction ID or Team..."
          />
        </div>
        <div className="flex gap-2">
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Types</option>
            <option>Entry Fee</option>
            <option>Purse Top-up</option>
            <option>Player Purchase</option>
          </select>
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Statuses</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <button className="px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 bg-white dark:bg-secondary-800 transition-colors">
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <TransactionHistory transactions={transactions} setTransactions={setTransactions} loading={loading} />
    </div>
  );
};

export default Payments;
