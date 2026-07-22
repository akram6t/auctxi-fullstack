import { IconSearch, IconFilter, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

const ScoutingPlayerList = () => {
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
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-800 flex flex-col sm:flex-row gap-4 items-center bg-secondary-50 dark:bg-secondary-800/50">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg leading-5 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            placeholder="Scout players by name or country..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white transition-shadow">
            <option>All Roles</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicket-Keeper</option>
          </select>
          <button className="px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 bg-white dark:bg-secondary-900 transition-colors">
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Player</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Role & Country</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Base Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading players...
                </td>
              </tr>
            ) : players.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No players found.
                </td>
              </tr>
            ) : players.map((player) => (
              <tr key={player.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-800 flex items-center justify-center text-secondary-600 dark:text-secondary-300 font-bold text-sm uppercase">
                      {player.name ? player.name.charAt(0) : '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                        {player.name}
                      </div>
                      <div className="text-xs text-secondary-500">{player.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white font-medium">{player.role}</div>
                  <div className="text-xs text-secondary-500">{player.country || 'Unknown'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary-900 dark:text-white">
                  ${player.basePrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    player.status === 'Available' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {player.status || 'Available'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => toast.success(player.shortlisted ? 'Removed from shortlist' : 'Added to shortlist')} className={`p-1.5 rounded-full transition-colors ${
                    player.shortlisted 
                      ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'text-secondary-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`} title={player.shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}>
                    {player.shortlisted ? <IconStarFilled size={20} /> : <IconStar size={20} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoutingPlayerList;
