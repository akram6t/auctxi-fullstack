import { IconGavel, IconUsers, IconRun, IconCurrencyDollar } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../../utils/api';

const StatCards = () => {
  const [statsData, setStatsData] = useState({
    totalAuctions: 0,
    totalTeams: 0,
    totalPlayers: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Total Auctions', value: statsData.totalAuctions, icon: IconGavel, change: '+12%', changeType: 'positive', link: '/admin/auctions' },
    { name: 'Registered Teams', value: statsData.totalTeams, icon: IconUsers, change: '+4.5%', changeType: 'positive', link: '/admin/teams' },
    { name: 'Players Pool', value: statsData.totalPlayers, icon: IconRun, change: '+18.2%', changeType: 'positive', link: '/admin/players' },
    { name: 'Total Users', value: statsData.totalUsers, icon: IconCurrencyDollar, change: '+8.1%', changeType: 'positive', link: '/admin/users' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative bg-white dark:bg-secondary-900 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden transition-all hover:shadow-md"
        >
          <dt>
            <div className="absolute bg-primary-500 rounded-lg p-3">
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {item.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {item.change}
            </p>
            <div className="absolute bottom-0 inset-x-0 bg-secondary-50 dark:bg-secondary-800/50 px-4 py-4 sm:px-6 border-t border-secondary-100 dark:border-secondary-800">
              <div className="text-sm">
                <Link to={item.link} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                  View all<span className="sr-only"> {item.name} stats</span>
                </Link>
              </div>
            </div>
          </dd>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
