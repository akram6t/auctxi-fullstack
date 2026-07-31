import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { IconCash, IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import { useSettings } from '../../../../context/SettingsContext';

const FinancialReport = () => {
  const { currencySymbol } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancial = async () => {
      try {
        const response = await api.get('/reports/financial');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch financial report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinancial();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-secondary-500">Loading Financial Data...</div>;
  }

  const { totalRevenue = `${currencySymbol}0.00`, successCount = 0, pendingCount = 0, failedCount = 0, revenueByType = [] } = data || {};
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <IconCash size={20} />
            </div>
            <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Processed</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{String(totalRevenue).replace('$', currencySymbol)}</p>
        </div>
        
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <IconCheck size={20} />
            </div>
            <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Successful</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{successCount} Txns</p>
        </div>

        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <IconClockHour4 size={20} />
            </div>
            <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{pendingCount} Txns</p>
        </div>

        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <IconX size={20} />
            </div>
            <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Failed</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{failedCount} Txns</p>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white mb-4">Revenue Breakdown by Type</h3>
        {revenueByType.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByType.map((entry, index) => (
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
                  formatter={(value) => `${currencySymbol}${value}`}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-secondary-500">
            No successful revenue data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReport;
