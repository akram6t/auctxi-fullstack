import { IconPlayerPlay, IconSettings } from '@tabler/icons-react';

const registeredAuctions = [
  { id: 'AUC-101', name: 'IPL Mega Auction 2024', date: 'Oct 20, 2024', remainingPurse: '$4.5M', status: 'Live' },
  { id: 'AUC-102', name: 'WPL Mini Auction', date: 'Nov 15, 2024', remainingPurse: '$10M (Full)', status: 'Upcoming' },
];

const RegisteredAuctionsTable = ({ onEnterLive }) => {
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Your Auctions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Event</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Your Purse</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {registeredAuctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-secondary-900 dark:text-white">{auction.name}</span>
                    <span className="text-xs text-secondary-500">{auction.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {auction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300 font-bold">
                  {auction.remainingPurse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    auction.status === 'Live' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {auction.status === 'Live' ? (
                    <button 
                      onClick={onEnterLive}
                      className="inline-flex items-center text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <IconPlayerPlay size={16} className="mr-1" /> Join Auction
                    </button>
                  ) : (
                    <button className="text-secondary-400 hover:text-primary-600 transition-colors p-1" title="Settings">
                      <IconSettings size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredAuctionsTable;
