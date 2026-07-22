import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconX, IconUpload } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';

const teamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  managerName: z.string().min(2, 'Owner/Manager name is required'),
  managerEmail: z.string().email('Valid email is required'),
  status: z.enum(['Active', 'Inactive']),
});

const CreateTeamForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      status: 'Active',
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      // Map frontend fields to backend
      const payload = {
        name: data.name,
        owner: data.managerName, // Backend might expect owner
        status: data.status,
      };
      await api.post('/teams', payload);
      toast.success('Team ' + data.name + ' onboarded successfully!');
      onClose();
    } catch (error) {
      console.error("Failed to create team", error);
      toast.error("Failed to onboard team");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-secondary-900/75 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-secondary-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-secondary-200 dark:border-secondary-800">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Onboard New Team</h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors">
            <IconX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-secondary-300 dark:border-secondary-700 flex flex-col items-center justify-center text-secondary-500 hover:text-primary-500 hover:border-primary-500 cursor-pointer transition-colors bg-secondary-50 dark:bg-secondary-800/50">
              <IconUpload size={24} className="mb-1" />
              <span className="text-xs font-medium">Team Logo</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Franchise Name</label>
            <input 
              {...register('name')} 
              type="text" 
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
              placeholder="e.g. Mumbai Indians"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Owner / Manager</label>
              <input 
                {...register('managerName')} 
                type="text" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                placeholder="Name"
              />
              {errors.managerName && <p className="mt-1 text-xs text-red-500">{errors.managerName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Owner Email</label>
              <input 
                {...register('managerEmail')} 
                type="email" 
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                placeholder="email@example.com"
              />
              {errors.managerEmail && <p className="mt-1 text-xs text-red-500">{errors.managerEmail.message}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Initial Status</label>
            <select 
              {...register('status')} 
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
            >
              <option value="Active">Active (Ready for auction)</option>
              <option value="Inactive">Inactive (Pending setup)</option>
            </select>
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
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamForm;
