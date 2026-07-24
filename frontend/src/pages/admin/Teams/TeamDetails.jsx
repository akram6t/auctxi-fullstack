import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft, IconUsersGroup, IconTrophy, IconCoin, IconUserCircle } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const [teamRes, playersRes] = await Promise.all([
          api.get(`/teams/${id}`),
          api.get(`/players?teamId=${id}`)
        ]);
        setTeam(teamRes.data);
        setPlayers(playersRes.data);
      } catch (error) {
        console.error("Failed to fetch team details", error);
        toast.error("Failed to load team details");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return <div className="py-10 text-center text-sm text-secondary-500">Loading team details...</div>;
  }

  if (!team) {
    return <div className="py-10 text-center text-sm text-red-500">Team not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/admin/teams" className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-white dark:bg-secondary-800 shadow-sm flex items-center justify-center p-1 border border-secondary-100 dark:border-secondary-700 overflow-hidden">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover rounded-lg" />
            ) : (
              <IconUsersGroup size={32} className="text-secondary-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              {team.name}
            </h1>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              Owner: {team.ownerEmail || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 flex items-center">
          <div className="p-3 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-4">
            <IconUsersGroup size={24} />
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Squad Size</dt>
            <dd className="mt-1 text-2xl font-semibold text-secondary-900 dark:text-white">{players.length} / 25</dd>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 flex items-center">
          <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-4">
            <IconCoin size={24} />
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Remaining Purse</dt>
            <dd className="mt-1 text-2xl font-semibold text-secondary-900 dark:text-white">{team.purse || '0 Cr'}</dd>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 flex items-center">
          <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 mr-4">
            <IconTrophy size={24} />
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Status</dt>
            <dd className="mt-1 text-2xl font-semibold text-secondary-900 dark:text-white">{team.status || 'Active'}</dd>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-secondary-900 dark:text-white">Squad Roster</h2>
        </div>
        {players.length === 0 ? (
          <div className="p-8 text-center text-secondary-500">
            No players assigned to this team yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
              <thead className="bg-secondary-50 dark:bg-secondary-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 text-secondary-400 flex items-center justify-center bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                          {player.imageUrl ? (
                            <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
                          ) : (
                            <IconUserCircle size={24} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900 dark:text-white">{player.name}</div>
                          <div className="text-sm text-secondary-500">{player.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {player.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      {player.soldPrice || player.basePrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
