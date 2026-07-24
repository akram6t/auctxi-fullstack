import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';
import ImageUpload from '../../../../components/ui/ImageUpload';

const playerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  country: z.string().min(2, 'Country is required'),
  role: z.enum(['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper']),
  basePrice: z.number().min(1000, 'Minimum price is 1000'),
  status: z.string().optional(),
});

const EditPlayerModal = ({ player, onClose, onSave }) => {
  const [imageUrl, setImageUrl] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: '',
      country: '',
      role: 'Batter',
      basePrice: 50000,
      status: 'Available'
    }
  });

  useEffect(() => {
    if (player) {
      reset({
        name: player.name,
        country: player.country,
        role: player.role,
        basePrice: player.basePrice,
        status: player.status || 'Available',
      });
      setImageUrl(player.imageUrl || '');
    }
  }, [player, reset]);

  if (!player) return null;

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, imageUrl };
      await api.put(`/players/${player.id}`, payload);
      toast.success('Player ' + data.name + ' updated successfully!');
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Failed to update player", error);
      toast.error("Failed to update player");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-secondary-900/75 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-secondary-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-secondary-200 dark:border-secondary-800">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Edit Player</h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors">
            <IconX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          
          <div className="flex justify-center mb-4">
            <ImageUpload 
              value={imageUrl}
              onChange={setImageUrl}
              folder="players"
              label="Player Photo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Full Name</label>
              <input 
                {...register('name')} 
                type="text" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Country</label>
              <input 
                {...register('country')} 
                type="text" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              />
              {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Playing Role</label>
              <select 
                {...register('role')} 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              >
                <option value="Batter">Batter</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket-Keeper">Wicket-Keeper</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Status</label>
              <select 
                {...register('status')} 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Unsold">Unsold</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Base Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-secondary-500 sm:text-sm">$</span>
                </div>
                <input
                  {...register('basePrice', { valueAsNumber: true })} 
                  type="number"
                  className="w-full pl-7 pr-12 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-secondary-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice.message}</p>}
            </div>
          </div>
          
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlayerModal;
