import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { IconWallet, IconUsersGroup } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { useSettings } from '../../../../context/SettingsContext';

const TeamSpendingReport = () => {
  const { currencySymbol } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get('/reports/performance');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch performance report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-secondary-500">Loading Team Spending Data...</div>;
  }

  const { teamStats = [] } = data || {};
  
  // Format data for Recharts
  const chartData = teamStats.map(team => ({
    name: team.name,
    'Remaining Purse': team.remainingPurse,
    'Squad Size': team.squadSize
  }));

  const totalRemainingPurse = teamStats.reduce((acc, team) => acc + (team.remainingPurse || 0), 0);
  const averageSquadSize = teamStats.length ? Math.round(teamStats.reduce((acc, team) => acc + (team.squadSize || 0), 0) / teamStats.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <IconWallet size={24} />
          </div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Remaining Purse</h3>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{currencySymbol}{totalRemainingPurse.toLocaleString()}</p>
        </div>
        
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
            <IconUsersGroup size={24} />
          </div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Average Squad Size</h3>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{averageSquadSize} Players</p>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white mb-4">Team Remaining Purse</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary-200)" />
              <XAxis dataKey="name" stroke="var(--color-secondary-500)" fontSize={12} />
              <YAxis stroke="var(--color-secondary-500)" fontSize={12} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-secondary-900)', 
                  borderColor: 'var(--color-secondary-800)',
                  color: 'white',
                  borderRadius: '0.5rem',
                }}
                itemStyle={{ color: 'white' }}
                cursor={{fill: 'var(--color-secondary-100)', opacity: 0.2}}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="Remaining Purse" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamSpendingReport;
