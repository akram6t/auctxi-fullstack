import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconDashboard,
  IconGavel,
  IconUsers,
  IconShieldLock,
  IconReceipt2,
  IconReportAnalytics,
  IconSettings,
  IconUser,
  IconRun,
} from '@tabler/icons-react';
import clsx from 'clsx';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const getLinks = (role) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: IconDashboard },
          { name: 'Auctions', path: '/admin/auctions', icon: IconGavel },
          { name: 'Teams', path: '/admin/teams', icon: IconUsers },
          { name: 'Players', path: '/admin/players', icon: IconRun },
          { name: 'Users', path: '/admin/users', icon: IconShieldLock },
          { name: 'Payments', path: '/admin/payments', icon: IconReceipt2 },
          { name: 'Reports', path: '/admin/reports', icon: IconReportAnalytics },
          { name: 'Settings', path: '/admin/settings', icon: IconSettings },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', path: '/manager/dashboard', icon: IconDashboard },
          { name: 'Auctions', path: '/manager/auctions', icon: IconGavel },
          { name: 'Players', path: '/manager/players', icon: IconRun },
          { name: 'Payments', path: '/manager/payments', icon: IconReceipt2 },
          { name: 'Reports', path: '/manager/reports', icon: IconReportAnalytics },
        ];
      case 'client':
        return [
          { name: 'Dashboard', path: '/client/dashboard', icon: IconDashboard },
          { name: 'Auctions', path: '/client/auctions', icon: IconGavel },
          { name: 'Players', path: '/client/players', icon: IconRun },
          { name: 'Payments', path: '/client/payments', icon: IconReceipt2 },
          { name: 'Profile', path: '/client/profile', icon: IconUser },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(user.role?.toLowerCase());

  return (
    <aside className="w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 flex-shrink-0 flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-secondary-200 dark:border-secondary-800">
        <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          AuctXI
        </span>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full uppercase">
          {user.role}
        </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100'
              )
            }
          >
            <link.icon size={20} stroke={1.5} />
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
