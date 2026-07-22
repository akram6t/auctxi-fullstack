import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const teamSpendData = [
  { name: 'CSK', spend: 4.5 },
  { name: 'MI', spend: 3.8 },
  { name: 'RCB', spend: 3.2 },
  { name: 'DC', spend: 2.9 },
  { name: 'KKR', spend: 2.1 },
];

const EventPerformanceReport = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white mb-6">Franchise Spending ($ Millions)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teamSpendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-secondary-200)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-secondary-500)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-secondary-500)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}M`} />
              <RechartsTooltip
                cursor={{ fill: 'var(--color-secondary-100)', opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: 'var(--color-secondary-900)',
                  borderColor: 'var(--color-secondary-800)',
                  color: 'white',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => [`$${value}M`, 'Spend']}
              />
              <Bar dataKey="spend" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EventPerformanceReport;
