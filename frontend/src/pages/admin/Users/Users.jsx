import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import UserManagementTable from './components/UserManagementTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users from the server");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeManagers = users.filter(u => u.role?.toLowerCase() === 'manager' && u.status !== 'Suspended').length;
  const activeClients = users.filter(u => u.role?.toLowerCase() === 'client' && u.status !== 'Suspended').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Manage system administrators, auctioneers, and team owners.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => toast.success('Invite link copied to clipboard!')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <IconPlus size={18} className="mr-2" />
            Invite User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Users</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">{loading ? '...' : totalUsers}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Active Managers</dt>
          <dd className="mt-1 text-3xl font-semibold text-primary-600">{loading ? '...' : activeManagers}</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Active Clients</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{loading ? '...' : activeClients}</dd>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg leading-5 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            placeholder="Search users by name or email..."
          />
        </div>
        <div className="flex gap-2">
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Client</option>
          </select>
          <select className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <button className="px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 bg-white dark:bg-secondary-800 transition-colors">
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <UserManagementTable users={users} setUsers={setUsers} loading={loading} />
    </div>
  );
};

export default Users;
