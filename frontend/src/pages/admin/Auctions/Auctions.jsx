import { useState, useEffect } from 'react';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import AuctionList from './components/AuctionList';
import AuctionModal from './components/CreateAuctionModal';

const Auctions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = (auction = null) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auctions');
      setAuctions(response.data);
    } catch (error) {
      console.error("Failed to fetch auctions", error);
      toast.error("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleSaveAuction = async (savedAuction, isEdit) => {
    await fetchAuctions();
  };

  const totalAuctions = auctions.length;
  const liveNow = auctions.filter(a => a.status?.toUpperCase() === 'ACTIVE').length;
  const upcoming = auctions.filter(a => a.status?.toUpperCase() === 'UPCOMING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Auctions Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Create and manage auction events, configure rules, and oversee bidding.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <IconPlus size={18} className="mr-2" />
            New Auction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Auctions</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '...' : totalAuctions}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Live Now</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '...' : liveNow}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Upcoming</dt>
          <dd className="mt-1 text-3xl font-semibold text-primary-600">{loading ? '...' : upcoming}</dd>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg leading-5 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            placeholder="Search auctions by name..."
          />
        </div>
        <select className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
          <option>All Statuses</option>
          <option>Upcoming</option>
          <option>Live</option>
          <option>Completed</option>
        </select>
      </div>

      <AuctionList 
        auctions={auctions} 
        setAuctions={setAuctions} 
        loading={loading}
        onEdit={handleOpenModal}
        onRefresh={fetchAuctions}
      />

      <AuctionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        auction={selectedAuction}
        onSave={handleSaveAuction}
      />
    </div>
  );
};

export default Auctions;
