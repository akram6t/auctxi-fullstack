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
    <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 h-full flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200/50 dark:border-secondary-800/50 flex justify-between items-center bg-white/50 dark:bg-secondary-900/50">
        <h3 className="text-lg leading-6 font-bold text-secondary-900 dark:text-white flex items-center gap-2">
          <IconTrophy className="text-primary-500" size={20} />
          My Squad {teamData ? <span className="text-primary-600 dark:text-primary-400">({teamData.shortName || teamData.name})</span> : ''}
        </h3>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/40">
          View All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {loading ? (
            <div className="p-6 text-center text-secondary-500">Loading squad...</div>
          ) : squadMembers.length === 0 ? (
            <div className="p-6 text-center text-secondary-500 text-sm">No players in your squad yet.</div>
          ) : (
            squadMembers.map((player) => (
              <li key={player.id} className="p-3 mx-2 my-1 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors rounded-2xl flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {player.name ? player.name.charAt(0) : '?'}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-secondary-900 dark:text-white">{player.name}</p>
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 mt-0.5">{player.role} • {player.country}</p>
                  </div>
                </div>
                <div className="text-right pr-2">
                   <p className="text-xs font-black text-secondary-900 dark:text-white bg-secondary-100 dark:bg-secondary-800 px-2.5 py-1 rounded-full">{currencySymbol}{player.basePrice || 0}</p>
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
