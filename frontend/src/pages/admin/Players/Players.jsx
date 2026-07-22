import { useState, useEffect } from 'react';
import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import PlayerTable from './components/PlayerTable';
import AddPlayerForm from './components/AddPlayerForm';

const Players = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get('/players');
        setPlayers(response.data);
      } catch (error) {
        console.error("Failed to fetch players", error);
        toast.error("Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const totalPlayers = players.length;
  const soldPlayers = players.filter(p => p.status?.toLowerCase() === 'sold').length;
  const availablePlayers = players.filter(p => p.status?.toLowerCase() === 'available').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Players Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Manage the player pool, update roles, base prices, and statuses.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={() => toast.success('CSV Import initiated...')}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-colors"
          >
            Import CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <IconPlus size={18} className="mr-2" />
            Add Player
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Registered Players</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '...' : totalPlayers}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Players Sold</dt>
          <dd className="mt-1 text-3xl font-semibold text-primary-600">{loading ? '...' : soldPlayers}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Currently Available</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '...' : availablePlayers}</dd>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg leading-5 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            placeholder="Search players by name or country..."
          />
        </div>
        <div className="flex gap-2">
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Roles</option>
            <option>Batter</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicket-Keeper</option>
          </select>
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Statuses</option>
            <option>Available</option>
            <option>Sold</option>
            <option>Unsold</option>
          </select>
          <button className="px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 bg-white dark:bg-secondary-800 transition-colors">
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <PlayerTable players={players} setPlayers={setPlayers} loading={loading} />

      <AddPlayerForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Players;
