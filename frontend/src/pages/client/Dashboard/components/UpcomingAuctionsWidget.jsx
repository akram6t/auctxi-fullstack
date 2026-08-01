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
    <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 h-full flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200/50 dark:border-secondary-800/50 bg-white/50 dark:bg-secondary-900/50">
        <h3 className="text-lg leading-6 font-bold text-secondary-900 dark:text-white">Upcoming Registered Events</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-2">
          {loading ? (
            <div className="p-6 text-center text-secondary-500">Loading events...</div>
          ) : upcomingAuctions.length === 0 ? (
            <div className="p-6 text-center text-secondary-500 text-sm">No upcoming events.</div>
          ) : (
            upcomingAuctions.map((auction) => (
              <li key={auction.id} className="p-5 mx-2 my-1 bg-white dark:bg-secondary-800/30 hover:bg-primary-50/50 dark:hover:bg-secondary-800/80 transition-colors rounded-2xl border border-secondary-100 dark:border-secondary-700/30 group cursor-default">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{auction.name}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-bold rounded-full uppercase tracking-wider ${
                      auction.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }`}>
                      {auction.status || 'UPCOMING'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:flex sm:justify-between">
                  <div className="sm:flex text-sm text-secondary-500 dark:text-secondary-400 gap-6 font-medium">
                    <p className="flex items-center">
                      <IconCalendar size={18} className="mr-2 flex-shrink-0 text-primary-500 dark:text-primary-400" />
                      {auction.date ? new Date(auction.date).toLocaleDateString() : 'TBD'}
                    </p>
                    <p className="mt-2 flex items-center sm:mt-0">
                      <IconMapPin size={18} className="mr-2 flex-shrink-0 text-blue-500 dark:text-blue-400" />
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
