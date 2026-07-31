import { useState } from 'react';
import { IconX, IconDeviceFloppy } from '@tabler/icons-react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

const CreateAuctionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    status: 'UPCOMING',
    totalPlayers: 0,
    budgetCap: '',
    timerTimeout: 15,
    rules: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auctions', formData);
      toast.success('Auction created successfully');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-secondary-200 dark:border-secondary-800">
        <div className="flex justify-between items-center p-6 border-b border-secondary-200 dark:border-secondary-800">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Create New Auction</h2>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
            <IconX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Event Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" placeholder="e.g. Summer League 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Date</label>
              <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900">
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Budget Cap (e.g. 10M, 4,500,000)</label>
              <input type="text" name="budgetCap" value={formData.budgetCap} onChange={handleChange} className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Timer Timeout (seconds)</label>
              <input type="number" name="timerTimeout" value={formData.timerTimeout} onChange={handleChange} min="5" max="120" className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" />
              <p className="text-xs text-secondary-500 mt-1">Duration of the countdown timer after a bid.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Total Players</label>
              <input type="number" name="totalPlayers" value={formData.totalPlayers} onChange={handleChange} className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Rules / Configuration</label>
            <textarea name="rules" value={formData.rules} onChange={handleChange} rows="3" className="w-full rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-2.5 border bg-white text-secondary-900" placeholder="Any specific rules for this auction..."></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-secondary-200 dark:border-secondary-800 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button disabled={loading} type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
              <IconDeviceFloppy size={18} />
              {loading ? 'Saving...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionModal;
