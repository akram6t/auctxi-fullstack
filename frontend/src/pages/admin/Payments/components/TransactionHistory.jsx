import { IconDownload, IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const TransactionHistory = ({ transactions, setTransactions, loading }) => {
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Transaction ID & Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Team / User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No transactions found.
                </td>
              </tr>
            ) : transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">TXN-{txn.id}</span>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(txn.date).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">{txn.reference || 'N/A'}</span>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">System generated</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {txn.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-secondary-900 dark:text-white">
                  ${txn.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                    txn.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    txn.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {txn.status === 'Success' && <IconCheck size={12} />}
                    {txn.status === 'Failed' && <IconX size={12} />}
                    {txn.status === 'Pending' && <IconClockHour4 size={12} />}
                    {txn.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toast.success('Receipt downloaded for TXN-' + txn.id)} className="text-secondary-400 hover:text-primary-600 transition-colors p-1 flex items-center gap-1 text-xs" title="Download Receipt">
                      <IconDownload size={16} /> Receipt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white dark:bg-secondary-900 px-4 py-3 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700 dark:text-secondary-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">150</span> transactions
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button disabled className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50 opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-primary-50 dark:bg-primary-900/20 text-sm font-medium text-primary-600 dark:text-primary-400 z-10">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
