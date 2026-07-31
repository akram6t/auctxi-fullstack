import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSettings } from '../../../../context/SettingsContext';
import api from '../../../../utils/api';

const EventPerformanceReport = () => {
  const { currencySymbol } = useSettings();
  const [teamSpendData, setTeamSpendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPerformance = async () => {
          try {
              const res = await api.get('/reports/performance');
              // Map remainingPurse to millions for the chart, or calculate spend if total purse is known.
              // We'll just show remainingPurse in Millions for now.
              if (res.data?.teamStats) {
                  const mapped = res.data.teamStats.map(team => ({
                      name: team.name,
                      spend: team.remainingPurse / 1000000 // Convert to millions
                  }));
                  setTeamSpendData(mapped);
              }
          } catch (err) {
              console.error(err);
          } finally {
              setLoading(false);
          }
      };
      fetchPerformance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white mb-6">Franchise Remaining Purse ({currencySymbol} Millions)</h3>
        {loading ? (
            <div className="h-80 w-full flex items-center justify-center text-secondary-500">
                Loading chart data...
            </div>
        ) : (
            <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={teamSpendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-secondary-200)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-secondary-500)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-secondary-500)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${currencySymbol}${val}M`} />
                <Tooltip
                    cursor={{ fill: 'var(--color-secondary-100)', opacity: 0.1 }}
                    contentStyle={{
                    backgroundColor: 'var(--color-secondary-900)',
                    borderColor: 'var(--color-secondary-800)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value) => [`${currencySymbol}${value.toFixed(2)}M`, 'Remaining']}
                />
                <Bar dataKey="spend" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventPerformanceReport;
