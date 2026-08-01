import { IconSearch, IconFilter, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';
import { useSettings } from '../../../../context/SettingsContext';

const ScoutingPlayerList = () => {
  const { currencySymbol } = useSettings();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [shortlist, setShortlist] = useState(() => {
    const saved = localStorage.getItem('shortlist');
    return saved ? JSON.parse(saved) : [];
  });

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

  const toggleShortlist = (playerId) => {
    let updated;
    if (shortlist.includes(playerId)) {
      updated = shortlist.filter(id => id !== playerId);
      toast.success('Removed from shortlist');
    } else {
      updated = [...shortlist, playerId];
      toast.success('Added to shortlist');
    }
    setShortlist(updated);
    localStorage.setItem('shortlist', JSON.stringify(updated));
  };

  const filteredPlayers = players.filter(p => {
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (p.country?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  return (
    <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 overflow-hidden">
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-800 flex flex-col sm:flex-row gap-4 items-center bg-secondary-50 dark:bg-secondary-800/50">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl leading-5 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] sm:text-sm transition-all"
            placeholder="Scout players by name or country..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full sm:w-40 pl-3 pr-10 py-2.5 text-base border-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-sm rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <option>All Roles</option>
            <option>Batter</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicketkeeper</option>
          </select>
          <button className="px-3 py-2.5 border border-white/40 dark:border-secondary-700/50 rounded-xl text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 bg-white dark:bg-secondary-900 transition-colors shadow-sm">
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50/50 dark:bg-secondary-800/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Player</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Role & Country</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Base Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800/50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading players...
                </td>
              </tr>
            ) : filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No players found.
                </td>
              </tr>
            ) : filteredPlayers.map((player) => (
              <tr key={player.id} className="hover:bg-secondary-50/80 dark:hover:bg-secondary-800/40 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 flex items-center justify-center text-secondary-700 dark:text-secondary-200 font-black text-sm uppercase shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
                      {player.name ? player.name.charAt(0) : '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                        {player.name}
                      </div>
                      <div className="text-xs font-medium text-secondary-500 mt-0.5">{player.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white font-bold">{player.role}</div>
                  <div className="text-xs font-medium text-secondary-500 mt-0.5">{player.country || 'Unknown'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white font-black">
                  {currencySymbol}{player.basePrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-bold rounded-full uppercase tracking-wider ${
                    player.status === 'Available' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                  }`}>
                    {player.status || 'Available'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => toggleShortlist(player.id)} className={`p-1.5 rounded-full transition-colors ${
                    shortlist.includes(player.id) 
                      ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'text-secondary-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`} title={shortlist.includes(player.id) ? 'Remove from shortlist' : 'Add to shortlist'}>
                    {shortlist.includes(player.id) ? <IconStarFilled size={20} /> : <IconStar size={20} />}
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
