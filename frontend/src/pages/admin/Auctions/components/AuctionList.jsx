import { IconEdit, IconTrash, IconEye, IconPlayerPlay } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';

const AuctionList = ({ auctions, setAuctions, loading, onEdit, onRefresh }) => {

  const handleStartAuction = async (auction) => {
    try {
      const payload = { ...auction, status: 'Active' };
      await api.put(`/auctions/${auction.id}`, payload);
      toast.success(`${auction.name} is now LIVE!`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to start auction");
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/auctions/${id}`);
      toast.error(`${name} deleted`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete auction");
    }
  };
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Auction Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Teams / Players
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Purse Limit
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
                  Loading auctions...
                </td>
              </tr>
            ) : auctions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No auctions found.
                </td>
              </tr>
            ) : auctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">{auction.name}</span>
                    <span className="text-xs text-secondary-500">AUC-{auction.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {new Date(auction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  Unknown / {auction.totalPlayers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                  {auction.budgetCap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    auction.status === 'Completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                    auction.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {auction.status || 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toast.info('Viewing details for ' + auction.name)} className="text-secondary-400 hover:text-primary-600 transition-colors p-1" title="View Details">
                      <IconEye size={18} />
                    </button>
                    {auction.status === 'Upcoming' && (
                      <button onClick={() => handleStartAuction(auction)} className="text-secondary-400 hover:text-green-600 transition-colors p-1" title="Start Auction">
                        <IconPlayerPlay size={18} />
                      </button>
                    )}
                    <button onClick={() => onEdit(auction)} className="text-secondary-400 hover:text-primary-600 transition-colors p-1" title="Edit">
                      <IconEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(auction.id, auction.name)} className="text-secondary-400 hover:text-red-600 transition-colors p-1" title="Delete">
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Mock) */}
      <div className="bg-white dark:bg-secondary-900 px-4 py-3 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700 dark:text-secondary-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">3</span> results
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
              <button disabled className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50 opacity-50 cursor-not-allowed">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
