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
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30 shadow-lg'
    },
    {
      name: 'Squad Size',
      value: actualSquadSize.toString(),
      icon: IconUsers,
      trend: `Max ${squadSize || 25} players`,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-primary-500 to-blue-600 shadow-primary-500/30 shadow-lg'
    },
    {
      name: 'Shortlisted Players',
      value: shortlisted,
      icon: IconStar,
      trend: 'For upcoming events',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-500/30 shadow-lg'
    },
    {
      name: 'Next Event In',
      value: nextEvent,
      icon: IconCalendarEvent,
      trend: 'Upcoming Auction',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30 shadow-lg'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className="group relative bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl overflow-hidden rounded-3xl border border-white/40 dark:border-secondary-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3.5 rounded-2xl ${stat.bgColor} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} stroke={2} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight mt-1">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-secondary-50/50 dark:bg-secondary-800/30 px-6 py-3.5 border-t border-secondary-200/50 dark:border-secondary-800/50">
            <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
              {stat.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientStatCards;
