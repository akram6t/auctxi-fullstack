import ManagerStatCards from './components/ManagerStatCards';
import UpcomingAuctionsWidget from './components/UpcomingAuctionsWidget';

const Dashboard = () => {
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
        <UpcomingAuctionsWidget />
        
        <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
           <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
             <span className="text-2xl font-black">!</span>
           </div>
           <h3 className="text-lg font-semibold text-secondary-900 dark:text-white text-center">Live Auction in Progress</h3>
           <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 text-center max-w-sm mb-6">
             The IPL Mega Auction 2024 is currently live. You are the designated auctioneer for this event.
           </p>
           <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors animate-pulse">
             Enter Live Console
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
