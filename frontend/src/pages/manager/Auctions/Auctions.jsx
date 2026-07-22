import { useState } from 'react';
import AssignedAuctionsTable from './components/AssignedAuctionsTable';
import LiveAuctionConsole from './components/LiveAuctionConsole';

const Auctions = () => {
  const [view, setView] = useState('list'); // 'list' | 'live'

  if (view === 'live') {
    return <LiveAuctionConsole onExit={() => setView('list')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Auction Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Select an active event to enter the live auction console.
          </p>
        </div>
      </div>

      <AssignedAuctionsTable onEnterLive={() => setView('live')} />
    </div>
  );
};

export default Auctions;
