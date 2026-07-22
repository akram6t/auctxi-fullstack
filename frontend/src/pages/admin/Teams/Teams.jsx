import { useState, useEffect } from 'react';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import TeamGrid from './components/TeamGrid';
import CreateTeamForm from './components/CreateTeamForm';

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
        toast.error("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const totalTeams = teams.length;
  // Fallback to totalTeams if status isn't available
  const activeTeams = teams.filter(t => t.status === 'Active').length || totalTeams;
  
  // Basic sum for purse strings like "100 Cr"
  const totalPurse = teams.reduce((acc, t) => {
    const val = parseInt((t.purse || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return acc + val;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Franchise Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Onboard teams, assign owners, and monitor purse balances.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <IconPlus size={18} className="mr-2" />
            Add Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Franchises</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '...' : totalTeams}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Active Teams</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '...' : activeTeams}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Purse Allocated</dt>
          <dd className="mt-1 text-3xl font-semibold text-primary-600">{loading ? '...' : `${totalPurse} Cr`}</dd>
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
            placeholder="Search franchises..."
          />
        </div>
      </div>

      <TeamGrid teams={teams} setTeams={setTeams} loading={loading} />

      <CreateTeamForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Teams;
