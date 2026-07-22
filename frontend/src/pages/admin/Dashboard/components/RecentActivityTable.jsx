import { useState, useEffect } from 'react';
import api from '../../../../utils/api';

const RecentActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/dashboard/activities');
        const mapped = response.data.map(act => ({
          id: act.id,
          user: 'System',
          action: act.type === 'payment' ? 'Payment processed' : act.type,
          target: act.description,
          status: 'Completed',
          time: new Date(act.time).toLocaleString(),
        }));
        setActivities(mapped);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">
          Recent Activity
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Target
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading activity...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No recent activity found.
                </td>
              </tr>
            ) : activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                  {activity.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {activity.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                  {activity.target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    activity.status === 'Completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-500 dark:text-secondary-400">
                  {activity.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-secondary-50 dark:bg-secondary-800/30 px-6 py-3 border-t border-secondary-200 dark:border-secondary-800">
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
          View all activity →
        </a>
      </div>
    </div>
  );
};

export default RecentActivityTable;
