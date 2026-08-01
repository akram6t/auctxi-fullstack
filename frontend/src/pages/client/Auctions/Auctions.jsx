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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            Franchise Auctions
          </h1>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
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
