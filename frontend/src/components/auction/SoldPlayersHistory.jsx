import { useState, useEffect } from 'react';
import { IconHistory, IconTrophy } from '@tabler/icons-react';
import api from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const SoldPlayersHistory = () => {
    const { currencySymbol } = useSettings();
    const [soldPlayers, setSoldPlayers] = useState([]);
    const [teams, setTeams] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch players and teams concurrently
                const [playersRes, teamsRes] = await Promise.all([
                    api.get('/players'),
                    api.get('/teams')
                ]);

                // Map teams for quick lookup
                const teamsMap = {};
                teamsRes.data.forEach(t => {
                    teamsMap[t.id] = t.name;
                });
                setTeams(teamsMap);

                // Filter sold players and sort by some logic if needed (e.g., ID descending to show newest first)
                const sold = playersRes.data
                    .filter(p => p.status?.toLowerCase() === 'sold')
                    .sort((a, b) => b.id - a.id); // Assuming higher ID means newer, or just keep as is
                
                setSoldPlayers(sold);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 5000); // refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-xl overflow-hidden border border-secondary-200 dark:border-secondary-800 mt-6">
            <div className="bg-secondary-50 dark:bg-secondary-800/80 px-6 py-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                    <IconHistory className="text-primary-500" size={20} />
                    Auction History (Sold Players)
                </h3>
                <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full">
                    {soldPlayers.length} Sold
                </span>
            </div>
            
            <div className="p-0 overflow-x-auto max-h-96 overflow-y-auto">
                {soldPlayers.length === 0 ? (
                    <div className="p-8 text-center text-secondary-500">
                        No players have been sold yet.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
                        <thead className="bg-secondary-50/50 dark:bg-secondary-800/30 sticky top-0 backdrop-blur-sm z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Player</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Sold To</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Winning Bid</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
                            {soldPlayers.map(player => (
                                <tr key={player.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {player.imageUrl ? (
                                                <img src={player.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover border border-secondary-200 dark:border-secondary-700" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-xs font-bold text-secondary-500">
                                                    {player.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-3 font-semibold text-sm text-secondary-900 dark:text-white">
                                                {player.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                                        {player.role}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-secondary-900 dark:text-white">
                                            <IconTrophy size={16} className="text-yellow-500" />
                                            {player.team ? player.team.name : (teams[player.teamId] || 'Unknown Team')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-black text-green-600 dark:text-green-400">
                                        {currencySymbol}{player.basePrice}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SoldPlayersHistory;
