import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const UpcomingAuctionsWidget = ({ auctions = [], loading = false }) => {
  const navigate = useNavigate();
  // Filter for upcoming/scheduled auctions
  const upcomingAuctions = auctions.filter(a => a.status === 'UPCOMING' || a.status === 'Scheduled' || a.status === 'Upcoming');

  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Your Upcoming Events</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-0">
        <ul className="divide-y divide-secondary-200 dark:divide-secondary-800">
          {upcomingAuctions.map((auction) => (
            <li key={auction.id} className="p-6 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">{auction.name}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    auction.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300'
                  }`}>
                    {auction.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex text-sm text-secondary-500 dark:text-secondary-400 gap-4">
                  <p className="flex items-center">
                    <IconCalendar size={16} className="mr-1.5 flex-shrink-0 text-secondary-400" />
                    {auction.date} at {auction.time}
                  </p>
                  <p className="mt-2 flex items-center sm:mt-0">
                    <IconMapPin size={16} className="mr-1.5 flex-shrink-0 text-secondary-400" />
                    {auction.location}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                 <button 
                    onClick={() => navigate('/manager/auctions')}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
                 >
                  Prepare Console &rarr;
                 </button>
              </div>
            </li>
          ))}
          {loading && (
            <li className="p-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
              Loading upcoming events...
            </li>
          )}
          {!loading && upcomingAuctions.length === 0 && (
            <li className="p-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
              No upcoming auctions assigned.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UpcomingAuctionsWidget;
