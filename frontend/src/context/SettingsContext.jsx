import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && Array.isArray(response.data)) {
          const defaults = {};
          response.data.forEach(s => {
            defaults[s.settingKey] = s.settingValue;
          });
          setSettings(defaults);
        }
      } catch (error) {
        console.error('Failed to fetch global settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'INR': return '₹';
      case 'GBP': return '£';
      case 'AUD': return 'A$';
      case 'USD':
      default:
        return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(settings.currency);

  // We provide the loading state in case some components need to wait,
  // but generally they can render right away with defaults.
  return (
    <SettingsContext.Provider value={{ settings, currencySymbol, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
