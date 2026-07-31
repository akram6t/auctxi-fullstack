import { useState } from 'react';
import RegisteredAuctionsTable from './components/RegisteredAuctionsTable';
import BiddingTerminal from './components/BiddingTerminal';

const Auctions = () => {
  const [view, setView] = useState('list'); // 'list' | 'live'
  const [activeAuctionId, setActiveAuctionId] = useState(null);

  if (view === 'live' && activeAuctionId) {
    return <BiddingTerminal auctionId={activeAuctionId} onExit={() => setView('list')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Franchise Auctions
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Join your registered live auctions and start bidding.
          </p>
        </div>
      </div>

      <RegisteredAuctionsTable onEnterLive={(id) => {
        setActiveAuctionId(id);
        setView('live');
      }} />
    </div>
  );
};

export default Auctions;
