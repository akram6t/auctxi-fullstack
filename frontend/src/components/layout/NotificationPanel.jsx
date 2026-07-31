import { useState, useRef, useEffect } from 'react';
import { IconBell, IconCheck } from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/notification/messages/${user.email}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notification/messages/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const notif of unread) {
      await handleMarkAsRead(notif.id);
    }
    toast.success("All notifications marked as read");
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) fetchNotifications(); }}
        className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors relative"
      >
        <IconBell size={22} stroke={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-secondary-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-900 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-800 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center bg-secondary-50 dark:bg-secondary-800/50">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
            <button onClick={handleMarkAllAsRead} className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
              <IconCheck size={14} /> Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {notifications.map((notif) => (
                  <li 
                    key={notif.id} 
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                    className={`p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <p className={`text-sm font-semibold mb-1 ${!notif.is_read ? 'text-secondary-900 dark:text-white' : 'text-secondary-700 dark:text-secondary-300'}`}>
                          {notif.subject}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1 leading-snug line-clamp-2">
                          {notif.message_text}
                        </p>
                        <p className="text-xs text-secondary-400 dark:text-secondary-500">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-secondary-500 dark:text-secondary-400 text-sm">
                No new notifications
              </div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-800/50 text-center">
            <button className="text-xs font-medium text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
