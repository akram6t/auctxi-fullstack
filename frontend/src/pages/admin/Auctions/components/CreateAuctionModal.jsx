import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';

import { useEffect } from 'react';

const auctionSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  purseLimit: z.number().min(1000, 'Minimum purse limit is 1000'),
  maxPlayers: z.number().min(11, 'Minimum 11 players per team'),
  status: z.string().optional(),
});

const AuctionModal = ({ isOpen, onClose, auction, onSave }) => {
  const isEdit = !!auction;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      purseLimit: 10000000, // 1 Crore default
      maxPlayers: 15,
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (auction) {
        // Parse datetime if available
        let d = '', t = '';
        if (auction.date) {
          const dt = new Date(auction.date);
          if (!isNaN(dt.getTime())) {
            d = dt.toISOString().split('T')[0];
            t = dt.toTimeString().substring(0, 5);
          }
        }
        reset({
          name: auction.name || '',
          date: d,
          time: t,
          purseLimit: auction.budgetCap || 10000000,
          maxPlayers: auction.totalPlayers || 15,
          status: auction.status || 'Upcoming',
        });
      } else {
        reset({
          name: '',
          date: '',
          time: '',
          purseLimit: 10000000,
          maxPlayers: 15,
          status: 'Upcoming',
        });
      }
    }
  }, [isOpen, auction, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        date: `${data.date}T${data.time}:00`,
        budgetCap: data.purseLimit,
        totalPlayers: data.maxPlayers,
        status: isEdit ? (data.status || auction.status) : 'Upcoming'
      };
      
      let savedAuction;
      if (isEdit) {
        const response = await api.put(`/auctions/${auction.id}`, payload);
        savedAuction = response.data;
        toast.success('Auction updated successfully!');
      } else {
        const response = await api.post('/auctions', payload);
        savedAuction = response.data;
        toast.success('Auction created successfully!');
      }
      onSave(savedAuction, isEdit);
      onClose();
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} auction`, error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} auction`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-secondary-900/75 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-secondary-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-secondary-200 dark:border-secondary-800">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {isEdit ? 'Edit Auction' : 'Create New Auction'}
          </h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors">
            <IconX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Auction Name</label>
            <input 
              {...register('name')} 
              type="text" 
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              placeholder="e.g. IPL 2025 Mega Auction"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Start Date</label>
              <input 
                {...register('date')} 
                type="date" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Start Time</label>
              <input 
                {...register('time')} 
                type="time" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Purse Limit (Per Team)</label>
              <input 
                {...register('purseLimit', { valueAsNumber: true })} 
                type="number" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.purseLimit && <p className="mt-1 text-xs text-red-500">{errors.purseLimit.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Max Players (Per Team)</label>
              <input 
                {...register('maxPlayers', { valueAsNumber: true })} 
                type="number" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.maxPlayers && <p className="mt-1 text-xs text-red-500">{errors.maxPlayers.message}</p>}
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionModal;
