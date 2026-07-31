import { useState, useEffect } from 'react';
import { IconDeviceFloppy, IconBell, IconLock, IconUserCircle, IconPalette, IconPlayerTrackNext } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const ManagerSettings = () => {
  const { user, login } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Manager',
    email: user?.email || 'manager@example.com',
    notificationsEnabled: true,
    theme: 'system',
    autoAdvance: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (user?.preferences) {
          try {
              const prefs = JSON.parse(user.preferences);
              setProfile(prev => ({ ...prev, ...prefs }));
          } catch (e) {
              console.error("Failed to parse preferences");
          }
      }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
        const payload = {
            name: profile.name,
            preferences: JSON.stringify({
                notificationsEnabled: profile.notificationsEnabled,
                theme: profile.theme,
                autoAdvance: profile.autoAdvance
            })
        };
        const res = await api.put(`/users/${user.id}`, payload);
        // Update user context with new user data
        login(res.data, localStorage.getItem('token'));
        toast.success('Manager settings saved successfully!');
    } catch (err) {
        console.error(err);
        toast.error('Failed to save settings');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Manager Settings</h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Manage your personal profile and preferences.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white flex items-center gap-2 mb-4">
              <IconUserCircle size={20} className="text-primary-500" />
              Profile Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-secondary-800 dark:border-secondary-700 dark:text-white sm:text-sm p-2.5 border bg-white text-secondary-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm bg-secondary-100 dark:bg-secondary-800 dark:border-secondary-700 dark:text-secondary-500 sm:text-sm p-2.5 border cursor-not-allowed text-secondary-900"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white flex items-center gap-2 mb-4">
                <IconBell size={20} className="text-primary-500" />
                Notifications
                </h3>
                <div className="flex items-center">
                <input
                    id="notificationsEnabled"
                    name="notificationsEnabled"
                    type="checkbox"
                    checked={profile.notificationsEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-secondary-900 dark:text-secondary-300">
                    Receive email alerts for successful bids
                </label>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white flex items-center gap-2 mb-4">
                <IconPalette size={20} className="text-primary-500" />
                Appearance
                </h3>
                <select
                    name="theme"
                    value={profile.theme}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-secondary-800 dark:border-secondary-700 dark:text-white sm:text-sm p-2.5 border bg-white text-secondary-900"
                >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                </select>
            </div>
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-6">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white flex items-center gap-2 mb-4">
              <IconPlayerTrackNext size={20} className="text-primary-500" />
              Auction Automation
            </h3>
            <div className="flex items-center">
              <input
                id="autoAdvance"
                name="autoAdvance"
                type="checkbox"
                checked={profile.autoAdvance}
                onChange={handleChange}
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="autoAdvance" className="ml-2 block text-sm text-secondary-900 dark:text-secondary-300">
                Automatically advance to the next player when an auction ends
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <IconDeviceFloppy size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerSettings;
