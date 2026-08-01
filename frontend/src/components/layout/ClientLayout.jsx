import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  IconDashboard,
  IconGavel,
  IconRun,
  IconReceipt2,
  IconUser,
  IconLogout,
  IconUserCircle,
  IconMenu2,
  IconX
} from '@tabler/icons-react';
import NotificationPanel from './NotificationPanel';
import { motion } from 'framer-motion';

// Pre-generate bubbles so they don't recreate on re-renders
const bubbles = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  size: Math.random() * 60 + 20,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 15,
  wobble: Math.random() * 100 - 50
}));

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/client/dashboard', icon: IconDashboard },
    { name: 'Auctions', path: '/client/auctions', icon: IconGavel },
    { name: 'Players', path: '/client/players', icon: IconRun },
    { name: 'Payments', path: '/client/payments', icon: IconReceipt2 },
    { name: 'Profile', path: '/client/profile', icon: IconUser },
  ];

  return (
    <div className="flex flex-col h-screen bg-yellow-50/80 dark:bg-secondary-950/80 overflow-hidden relative selection:bg-primary-500/30">
      {/* Animated Bubble Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-yellow-300/30 dark:bg-yellow-600/10 backdrop-blur-[2px] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              bottom: -100,
            }}
            animate={{
              y: [0, -window.innerHeight - 200],
              x: [0, bubble.wobble],
              rotate: [0, 360]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-400/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Top Navigation Bar (Glassmorphic) */}
      <header className="h-16 backdrop-blur-xl bg-white/70 dark:bg-secondary-900/70 border-b border-secondary-200/50 dark:border-secondary-800/50 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0 transition-colors duration-200 sticky top-0 shadow-sm">
        
        {/* Brand & Desktop Links */}
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              AuctXI
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full space-x-1 ml-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    'group relative flex items-center gap-2 h-full px-4 text-sm font-semibold transition-all duration-200 ease-out',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon 
                      size={18} 
                      stroke={isActive ? 2 : 1.5} 
                      className={clsx('transition-transform duration-200 group-hover:scale-110')}
                    />
                    {link.name}
                    
                    {/* Active Indicator Line */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 to-blue-500 rounded-t-md"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 sm:gap-4 h-full">
          <NotificationPanel />
          
          <div className="hidden sm:block h-6 w-px bg-secondary-200 dark:bg-secondary-700"></div>
          
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 leading-none mb-0.5">
                {user?.name || 'Client'}
              </p>
              <p className="text-xs text-secondary-500 capitalize">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <IconUserCircle size={24} stroke={1.5} />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-secondary-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1"
              title="Logout"
            >
              <IconLogout size={22} stroke={1.5} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-secondary-600 dark:text-secondary-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 z-30 shadow-lg">
          <nav className="flex flex-col px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
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
            <div className="h-px bg-secondary-200 dark:bg-secondary-800 my-2"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
            >
              <IconLogout size={20} stroke={1.5} />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto z-10 p-4 sm:p-6 lg:p-8 scroll-smooth">
        <div className="mx-auto max-w-7xl relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
