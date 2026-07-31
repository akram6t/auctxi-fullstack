import { useState, useEffect } from 'react';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import api from '../../../../utils/api';

const UpcomingAuctionsWidget = () => {
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get('/auctions');
        // Filter to show only UPCOMING or ACTIVE ones, or just show all if none
        const activeOrUpcoming = res.data.filter(a => a.status === 'UPCOMING' || a.status === 'ACTIVE' || !a.status);
        // Take top 5
        setUpcomingAuctions(activeOrUpcoming.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch upcoming auctions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Upcoming Registered Events</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-0">
        <ul className="divide-y divide-secondary-200 dark:divide-secondary-800">
          {loading ? (
            <div className="p-6 text-center text-secondary-500">Loading events...</div>
          ) : upcomingAuctions.length === 0 ? (
            <div className="p-6 text-center text-secondary-500 text-sm">No upcoming events.</div>
          ) : (
            upcomingAuctions.map((auction) => (
              <li key={auction.id} className="p-6 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">{auction.name}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      auction.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {auction.status || 'UPCOMING'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex text-sm text-secondary-500 dark:text-secondary-400 gap-4">
                    <p className="flex items-center">
                      <IconCalendar size={16} className="mr-1.5 flex-shrink-0 text-secondary-400" />
                      {auction.date ? new Date(auction.date).toLocaleDateString() : 'TBD'}
                    </p>
                    <p className="mt-2 flex items-center sm:mt-0">
                      <IconMapPin size={16} className="mr-1.5 flex-shrink-0 text-secondary-400" />
                      Online
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default UpcomingAuctionsWidget;
