import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerStatCards from './components/ManagerStatCards';
import UpcomingAuctionsWidget from './components/UpcomingAuctionsWidget';
import api from '../../../utils/api';

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get('/auctions');
        setAuctions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const activeAuction = auctions.find(a => a.status === 'ACTIVE' || a.status === 'Live');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Auctioneer Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Welcome back! Here's an overview of your assigned events and performance.
          </p>
        </div>
      </div>

      <ManagerStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAuctionsWidget auctions={auctions} loading={loading} />
        
        {activeAuction ? (
            <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-green-500 dark:border-green-600 p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-black animate-pulse">!</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white text-center">Live Auction in Progress</h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 text-center max-w-sm mb-6">
                    {activeAuction.name} is currently live. You are the designated auctioneer for this event.
                </p>
                <button 
                    onClick={() => navigate('/manager/auctions')}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors animate-pulse"
                >
                    Enter Live Console
                </button>
            </div>
        ) : (
            <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="h-16 w-16 bg-secondary-100 dark:bg-secondary-800 text-secondary-400 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">No Live Auctions</h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 max-w-sm">
                    There are no live auctions assigned to you at the moment.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
