import { IconEdit, IconTrash, IconUserCircle } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';
import { useState } from 'react';
import EditPlayerModal from './EditPlayerModal';

const PlayerTable = ({ players, setPlayers, loading, onRefresh }) => {
  const [editPlayer, setEditPlayer] = useState(null);

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/players/${id}`);
      toast.error(`${name} removed from pool`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete player");
    }
  };
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Player Info
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Base Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
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
                    <div className="flex-shrink-0 h-10 w-10 text-secondary-400 flex items-center justify-center bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                      {player.imageUrl ? (
                        <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
                      ) : (
                        <IconUserCircle size={24} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {player.name}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {player.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white">{player.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                  {player.basePrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      player.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      player.status === 'Sold' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {player.status || 'Available'}
                    </span>
                    {player.teamId && (
                      <span className="text-xs text-secondary-500 font-medium">Team {player.teamId}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditPlayer(player)} className="text-secondary-400 hover:text-primary-600 transition-colors p-1" title="Edit">
                      <IconEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(player.id, player.name)} className="text-secondary-400 hover:text-red-600 transition-colors p-1" title="Delete">
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Mock) */}
      <div className="bg-white dark:bg-secondary-900 px-4 py-3 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700 dark:text-secondary-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">50</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button disabled className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50 opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-primary-50 dark:bg-primary-900/20 text-sm font-medium text-primary-600 dark:text-primary-400 z-10">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      <EditPlayerModal 
        player={editPlayer}
        onClose={() => setEditPlayer(null)}
        onSave={onRefresh}
      />
    </div>
  );
};

export default PlayerTable;
