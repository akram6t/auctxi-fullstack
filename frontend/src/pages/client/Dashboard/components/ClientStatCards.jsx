import { IconWallet, IconUsers, IconStar, IconCalendarEvent } from '@tabler/icons-react';

const stats = [
  {
    name: 'Remaining Purse',
    value: '$4,500,000',
    icon: IconWallet,
    trend: 'Out of $10M total',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    name: 'Squad Size',
    value: '18',
    icon: IconUsers,
    trend: 'Max 25 players',
    color: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30'
  },
  {
    name: 'Shortlisted Players',
    value: '24',
    icon: IconStar,
    trend: 'For upcoming IPL 2024',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    name: 'Next Event In',
    value: '4 Days',
    icon: IconCalendarEvent,
    trend: 'WPL Mini Auction',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  }
];

const ClientStatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-secondary-900 dark:text-white">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-secondary-50 dark:bg-secondary-800/50 px-5 py-3 border-t border-secondary-200 dark:border-secondary-800">
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              {stat.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientStatCards;
