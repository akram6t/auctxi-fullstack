import { useAuth } from '../../context/AuthContext';
import { IconLogout, IconUserCircle, IconBell, IconSearch, IconUserShield } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleRoleSwitch = (e) => {
    const newRole = e.target.value;
    if (newRole && user) {
      // Mock switching roles
      login({ ...user, role: newRole });
      navigate(`/${newRole}/dashboard`);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 flex items-center justify-between px-6 transition-colors duration-200">
      <div className="flex items-center flex-1 gap-4">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="w-full bg-secondary-50 dark:bg-secondary-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 transition-shadow"
            placeholder="Search auctions, players..."
          />
        </div>

        {/* Dev Tool: Role Switcher */}
        {user && (
          <div className="hidden lg:flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/50">
            <IconUserShield size={16} className="text-primary-600 dark:text-primary-400" />
            <select 
              value={user.role} 
              onChange={handleRoleSwitch}
              className="bg-transparent text-xs font-semibold text-primary-700 dark:text-primary-300 focus:outline-none cursor-pointer"
            >
              <option value="admin">Admin View</option>
              <option value="manager">Manager View</option>
              <option value="client">Client View</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors relative">
          <IconBell size={22} stroke={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-secondary-200 dark:bg-secondary-700 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 leading-none mb-1">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <IconUserCircle size={24} stroke={1.5} />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 ml-2 text-secondary-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <IconLogout size={22} stroke={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
