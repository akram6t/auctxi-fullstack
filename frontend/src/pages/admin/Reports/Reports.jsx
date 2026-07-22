import { IconDownload, IconPrinter } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import AuctionSummaryReport from './components/AuctionSummaryReport';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            View insights, auction summaries, and export data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={() => toast.info('Preparing print view...')}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-colors"
          >
            <IconPrinter size={18} className="mr-2" />
            Print
          </button>
          <button 
            onClick={() => toast.success('Exporting report to PDF...')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <IconDownload size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 whitespace-nowrap">Select Auction Report:</label>
        <select className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
          <option>IPL Mega Auction 2024 (Completed)</option>
          <option>WPL Mini Auction 2024 (Completed)</option>
        </select>
      </div>

      <AuctionSummaryReport />
    </div>
  );
};

export default Reports;
