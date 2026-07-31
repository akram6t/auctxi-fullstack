import { useState, useEffect } from 'react';
import { IconTrophy } from '@tabler/icons-react';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';

const MySquadWidget = () => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [squadMembers, setSquadMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSquad = async () => {
      try {
        if (!user?.email) return;
        
        // Find team
        const teamRes = await api.get('/teams');
        const myTeam = teamRes.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
        
        if (myTeam) {
          setTeamData(myTeam);
          // Fetch players for this team
          const playersRes = await api.get(`/players?teamId=${myTeam.id}`);
          setSquadMembers(playersRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch squad data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSquad();
  }, [user]);

  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">
          My Squad {teamData ? `(${teamData.shortName || teamData.name})` : ''}
        </h3>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
          View All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-0">
        <ul className="divide-y divide-secondary-200 dark:divide-secondary-800">
          {loading ? (
            <div className="p-6 text-center text-secondary-500">Loading squad...</div>
          ) : squadMembers.length === 0 ? (
            <div className="p-6 text-center text-secondary-500 text-sm">No players in your squad yet.</div>
          ) : (
            squadMembers.map((player) => (
              <li key={player.id} className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                    {player.name ? player.name.charAt(0) : '?'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">{player.name}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{player.role} • {player.country}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-semibold text-secondary-900 dark:text-white">{currencySymbol}{player.basePrice || 0}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MySquadWidget;
