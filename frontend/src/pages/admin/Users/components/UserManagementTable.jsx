import { IconEdit, IconTrash, IconLock, IconLockOpen, IconMail } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';
import { useState } from 'react';
import EditUserModal from './EditUserModal';

const UserManagementTable = ({ users, setUsers, loading, onRefresh }) => {
  const [editUser, setEditUser] = useState(null);

  const handleSuspend = async (id, name, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
      await api.put(`/users/${id}`, { status: newStatus });
      toast.warning(`${name} status changed to ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to change user status");
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/users/${id}`);
      toast.error(`Deleted user ${name}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="relative px-6 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No users found.
                </td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                      {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary-900 dark:text-white capitalize">
                        {user.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-secondary-500 flex items-center gap-1">
                        <IconMail size={14} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                    user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                    user.role?.toLowerCase() === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    user.status === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {user.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                  {user.lastLogin || 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditUser(user)} className="text-secondary-400 hover:text-primary-600 transition-colors p-1" title="Edit User">
                      <IconEdit size={18} />
                    </button>
                    {user.status === 'Suspended' ? (
                      <button onClick={() => handleSuspend(user.id, user.name, user.status)} className="text-secondary-400 hover:text-green-600 transition-colors p-1" title="Unsuspend">
                        <IconLockOpen size={18} />
                      </button>
                    ) : (
                      <button onClick={() => handleSuspend(user.id, user.name, user.status)} className="text-secondary-400 hover:text-yellow-600 transition-colors p-1" title="Suspend">
                        <IconLock size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(user.id, user.name)} className="text-secondary-400 hover:text-red-600 transition-colors p-1" title="Delete">
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white dark:bg-secondary-900 px-4 py-3 border-t border-secondary-200 dark:border-secondary-800 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700 dark:text-secondary-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button disabled className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50 opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 bg-primary-50 dark:bg-primary-900/20 text-sm font-medium text-primary-600 dark:text-primary-400 z-10">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm font-medium text-secondary-500 hover:bg-secondary-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      <EditUserModal 
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={onRefresh}
      />
    </div>
  );
};

export default UserManagementTable;
