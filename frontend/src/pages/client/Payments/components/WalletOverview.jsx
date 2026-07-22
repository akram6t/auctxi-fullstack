import { IconWallet, IconCreditCard, IconReceipt } from '@tabler/icons-react';

const WalletOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary-400 opacity-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-sm font-medium uppercase tracking-wider mb-1">Franchise Purse Balance</p>
              <h2 className="text-4xl font-black tracking-tight">$4,500,000</h2>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IconWallet size={32} />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20 flex gap-6">
            <div>
               <p className="text-primary-200 text-xs">Total Capacity</p>
               <p className="font-semibold">$10,000,000</p>
            </div>
            <div>
               <p className="text-primary-200 text-xs">Spent So Far</p>
               <p className="font-semibold">$5,500,000</p>
            </div>
            <div>
               <p className="text-primary-200 text-xs">Status</p>
               <p className="font-semibold text-green-300">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col justify-center gap-4">
         <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Quick Actions</h3>
         <button className="w-full flex items-center justify-center gap-2 py-3 bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white font-medium rounded-lg transition-colors">
           <IconCreditCard size={20} /> Request Purse Top-up
         </button>
         <button className="w-full flex items-center justify-center gap-2 py-3 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 text-secondary-700 dark:text-secondary-300 font-medium rounded-lg transition-colors">
           <IconReceipt size={20} /> Download Statements
         </button>
      </div>
    </div>
  );
};

export default WalletOverview;
