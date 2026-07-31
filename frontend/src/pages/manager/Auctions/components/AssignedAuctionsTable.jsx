import { useState, useEffect } from 'react';
import { IconPlayerPlay, IconSettings } from '@tabler/icons-react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

const AssignedAuctionsTable = ({ onEnterLive, onOpenSettings }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuctions = async () => {
    try {
      const res = await api.get('/auctions');
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleCloseAuction = async (auction) => {
    if (!window.confirm(`Are you sure you want to close "${auction.name}"? This action cannot be undone.`)) return;
    try {
        const updatedAuction = { ...auction, status: 'COMPLETED' };
        await api.put(`/auctions/${auction.id}`, updatedAuction);
        toast.success(`Auction "${auction.name}" has been closed.`);
        fetchAuctions();
    } catch (err) {
        console.error(err);
        toast.error('Failed to close the auction');
    }
  };

  if (loading) return <div className="p-8 text-center text-secondary-500">Loading auctions...</div>;

  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Your Assigned Events</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Event</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Stats</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {auctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-secondary-900 dark:text-white">{auction.name}</span>
                    <span className="text-xs text-secondary-500">ID: {auction.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {auction.date ? new Date(auction.date).toLocaleDateString() : 'TBD'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {auction.totalPlayers} Players / {auction.budgetCap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    auction.status === 'ACTIVE' || auction.status === 'Live' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse' :
                    auction.status === 'UPCOMING' || auction.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300'
                  }`}>
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {auction.status === 'ACTIVE' || auction.status === 'Live' ? (
                    <div className="flex justify-end gap-2">
                        <button 
                        onClick={() => onEnterLive(auction.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm shadow-green-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                        <IconPlayerPlay size={16} /> Enter Console
                        </button>
                        <button 
                        onClick={() => handleCloseAuction(auction)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                        Close Auction
                        </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onOpenSettings(auction)}
                      className="text-secondary-400 hover:text-primary-600 transition-colors p-1" 
                      title="Settings"
                    >
                      <IconSettings size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {auctions.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-secondary-500">
                        No assigned events found. Create one to get started!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedAuctionsTable;
