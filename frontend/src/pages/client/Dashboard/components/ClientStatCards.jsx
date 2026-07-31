import { IconWallet, IconUsers, IconStar, IconCalendarEvent } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';

const ClientStatCards = () => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [nextEvent, setNextEvent] = useState('TBD');
  const [shortlisted, setShortlisted] = useState('0');
  const [actualSquadSize, setActualSquadSize] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;
      try {
        // Fetch team
        const res = await api.get('/teams');
        const myTeam = res.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
        if (myTeam) {
          setTeamData(myTeam);
          
          // Fetch players for squad size
          const playersRes = await api.get(`/players?teamId=${myTeam.id}`);
          setActualSquadSize(playersRes.data.length);
        }

        // Fetch auctions for Next Event
        const auctionsRes = await api.get('/auctions');
        const activeOrUpcoming = auctionsRes.data.filter(a => a.status === 'UPCOMING' || a.status === 'ACTIVE' || !a.status);
        if (activeOrUpcoming.length > 0) {
          const next = activeOrUpcoming[0];
          setNextEvent(next.date ? new Date(next.date).toLocaleDateString() : 'TBD');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, [user]);

  const purse = teamData?.purse || '0';
  const formattedPurse = parseFloat(purse.toString().replace(/[^0-9.]/g, '') || 0).toLocaleString();
  const squadSize = teamData?.squadSize || 0;

  const stats = [
    {
      name: 'Remaining Purse',
      value: `${currencySymbol}${formattedPurse}`,
      icon: IconWallet,
      trend: `Available budget`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      name: 'Squad Size',
      value: actualSquadSize.toString(),
      icon: IconUsers,
      trend: `Max ${squadSize || 25} players`,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30'
    },
    {
      name: 'Shortlisted Players',
      value: shortlisted,
      icon: IconStar,
      trend: 'For upcoming events',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      name: 'Next Event In',
      value: nextEvent,
      icon: IconCalendarEvent,
      trend: 'Upcoming Auction',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

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
