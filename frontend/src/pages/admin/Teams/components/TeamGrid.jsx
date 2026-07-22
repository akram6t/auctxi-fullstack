import { IconEdit, IconTrash, IconUsersGroup } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';

const TeamGrid = ({ teams, setTeams, loading }) => {

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/teams/${id}`);
      setTeams(teams.filter(t => t.id !== id));
      toast.error(`${name} deleted`);
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full py-10 text-center text-sm text-secondary-500">
          Loading teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="col-span-full py-10 text-center text-sm text-secondary-500">
          No teams found.
        </div>
      ) : teams.map((team) => (
        <div key={team.id} className="bg-white dark:bg-secondary-900 shadow-sm hover:shadow-md rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden transition-all group">
          <div className={`h-24 bg-gradient-to-r ${team.color || 'from-primary-500 to-primary-700'} relative`}>
            <div className="absolute -bottom-6 left-6 h-12 w-12 rounded-lg bg-white dark:bg-secondary-800 shadow-sm flex items-center justify-center p-2 border border-secondary-100 dark:border-secondary-700">
              <IconUsersGroup size={24} className="text-secondary-400" />
            </div>
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toast.info('Edit mode enabled for ' + team.name)} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition-colors">
                <IconEdit size={16} />
              </button>
              <button onClick={() => handleDelete(team.id, team.name)} className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-md text-white backdrop-blur-sm transition-colors">
                <IconTrash size={16} />
              </button>
            </div>
          </div>
          
          <div className="pt-10 pb-5 px-6">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white truncate" title={team.name}>
                {team.name}
              </h3>
            </div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
              Owner: {team.owner || 'N/A'}
            </p>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary-500">Purse Remaining</span>
                  <span className="font-semibold text-secondary-900 dark:text-white">{team.purseBalance}</span>
                </div>
                <div className="w-full bg-secondary-100 dark:bg-secondary-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${team.color || 'from-primary-500 to-primary-700'}`} style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary-500">Squad Size</span>
                  <span className="font-semibold text-secondary-900 dark:text-white">{team.totalPlayers || 0} / {team.maxPlayers || 25}</span>
                </div>
                <div className="w-full bg-secondary-100 dark:bg-secondary-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${team.color || 'from-primary-500 to-primary-700'}`} style={{ width: `${((team.totalPlayers || 0)/(team.maxPlayers || 25))*100}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex items-center justify-between">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                team.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400'
              }`}>
                {team.status}
              </span>
              <button onClick={() => toast.info('Loading squad details for ' + team.name)} className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                View Squad →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamGrid;
