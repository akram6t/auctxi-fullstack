import { useState } from 'react';
import AssignedAuctionsTable from './components/AssignedAuctionsTable';
import LiveAuctionConsole from './components/LiveAuctionConsole';
import CreateAuctionModal from './components/CreateAuctionModal';
import AuctionSettingsModal from './components/AuctionSettingsModal';
import { IconPlus } from '@tabler/icons-react';

const Auctions = () => {
  const [view, setView] = useState('list'); // 'list' | 'live'
  const [activeAuctionId, setActiveAuctionId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  if (view === 'live' && activeAuctionId) {
    return <LiveAuctionConsole auctionId={activeAuctionId} onExit={() => setView('list')} />;
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Auction Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Select an active event to enter the live auction console or configure events.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
          >
            <IconPlus size={18} />
            Create Auction
          </button>
        </div>
      </div>

      <AssignedAuctionsTable 
        key={refreshKey}
        onEnterLive={(id) => {
          setActiveAuctionId(id);
          setView('live');
        }}
        onOpenSettings={(auction) => setSelectedAuction(auction)}
      />

      <CreateAuctionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
            setIsCreateModalOpen(false);
            handleRefresh();
        }}
      />

      {selectedAuction && (
        <AuctionSettingsModal 
            isOpen={!!selectedAuction}
            auction={selectedAuction}
            onClose={() => setSelectedAuction(null)}
            onSuccess={() => {
                setSelectedAuction(null);
                handleRefresh();
            }}
        />
      )}
    </div>
  );
};

export default Auctions;
