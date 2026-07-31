import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconDeviceFloppy, IconBell, IconShieldLock } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';
import { useSettings } from '../../../../context/SettingsContext';

const SystemSettingsForm = () => {
  const { currencySymbol } = useSettings();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      defaultTimer: 30,
      minIncrement: 10000,
      currency: 'USD',
      maxSquadSize: 15,
      basePurse: 100000000,
      themeColor: 'blue',
      sessionTimeout: '24',
      notifications: true,
      maintenanceMode: false,
      requireTwoFactor: false
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && response.data.length > 0) {
          const defaults = {};
          response.data.forEach(s => {
            if (['defaultTimer', 'minIncrement', 'maxSquadSize', 'basePurse'].includes(s.settingKey)) {
              defaults[s.settingKey] = Number(s.settingValue);
            } else if (['notifications', 'maintenanceMode', 'requireTwoFactor'].includes(s.settingKey)) {
              defaults[s.settingKey] = s.settingValue === 'true';
            } else {
              defaults[s.settingKey] = s.settingValue;
            }
          });
          reset(defaults);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      // Backend expects settingKey and settingValue
      // We will loop and send individually or in batch if API supports
      const promises = Object.keys(data).map(key => 
        api.post('/settings', { settingKey: key, settingValue: String(data[key]) })
      );
      await Promise.all(promises);
      toast.success('System settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save system settings');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Auction Rules Section */}
      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
          <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
            <IconShieldLock size={20} className="text-primary-500" />
            Global Auction Rules
          </h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            These settings will apply as defaults for all newly created auctions.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Default Bid Timer (seconds)</label>
              <input 
                {...register('defaultTimer', { valueAsNumber: true })} 
                type="number" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Default Min Bid Increment</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-secondary-500 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  {...register('minIncrement', { valueAsNumber: true })} 
                  type="number"
                  className="w-full pl-7 px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">System Currency</label>
            <select 
              {...register('currency')} 
              className="w-full sm:w-1/2 px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Platform Configurations Section */}
      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
          <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
            <IconShieldLock size={20} className="text-primary-500" />
            Platform & Team Defaults
          </h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Configure default limits and rules for newly created teams.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Max Squad Size</label>
              <input 
                {...register('maxSquadSize', { valueAsNumber: true })} 
                type="number" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Base Team Purse</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-secondary-500 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  {...register('basePurse', { valueAsNumber: true })} 
                  type="number"
                  className="w-full pl-7 px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Preferences Section */}
      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
          <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
            <IconBell size={20} className="text-primary-500" />
            System Preferences
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Email Notifications</h4>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Send system emails to users upon registration and transactions.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('notifications')} className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="pt-4 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Maintenance Mode</h4>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Disable access for managers and clients during system upgrades.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('maintenanceMode')} className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="pt-4 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Require Two-Factor Authentication (2FA)</h4>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Enforce 2FA for all administrative accounts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('requireTwoFactor')} className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-secondary-200 dark:border-secondary-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Theme Accent Color</label>
                <select 
                  {...register('themeColor')} 
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                >
                  <option value="blue">Standard Blue</option>
                  <option value="indigo">Deep Indigo</option>
                  <option value="green">Emerald Green</option>
                  <option value="purple">Royal Purple</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Session Timeout</label>
                <select 
                  {...register('sessionTimeout')} 
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                >
                  <option value="1">1 Hour</option>
                  <option value="4">4 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours (Default)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <IconDeviceFloppy size={18} className="mr-2" />
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default SystemSettingsForm;
