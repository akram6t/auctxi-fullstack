import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { IconTrophy, IconUserOff, IconCurrencyDollar } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { useSettings } from '../../../../context/SettingsContext';

const AuctionSummaryReport = () => {
  const { currencySymbol } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/reports/summary');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch summary report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-secondary-500">Loading summary...</div>;
  }

  const { pieData = [], topBuys = [], totalPlayersSold = 0, unsoldPlayers = 0, totalMoneySpent = `${currencySymbol}0M` } = data || {};
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <IconTrophy size={24} />
          </div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Players Sold</h3>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{totalPlayersSold}</p>
        </div>
        
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
            <IconUserOff size={24} />
          </div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Unsold Players</h3>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{unsoldPlayers}</p>
        </div>
        
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
            <IconCurrencyDollar size={24} />
          </div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Money Spent</h3>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{totalMoneySpent.replace('$', currencySymbol)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
          <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white mb-4">Player Sell Rate</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-secondary-900)', 
                    borderColor: 'var(--color-secondary-800)',
                    color: 'white',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Buys Table */}
        <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
            <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Most Expensive Players</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <ul className="divide-y divide-secondary-200 dark:divide-secondary-800">
              {topBuys.map((buy, idx) => (
                <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{buy.name}</p>
                      <p className="text-xs text-secondary-500">{buy.team}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {buy.price.replace('$', currencySymbol)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionSummaryReport;
