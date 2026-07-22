import { IconDownload } from '@tabler/icons-react';
import EventPerformanceReport from './components/EventPerformanceReport';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Event Analytics
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            View performance metrics for the auctions you manage.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <IconDownload size={18} className="mr-2" />
            Download Summary
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 whitespace-nowrap">Select Event:</label>
        <select className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow">
          <option>IPL Mega Auction 2024</option>
          <option>WPL Mini Auction</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Revenue Generated</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">$65.5M</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Players Sold</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">142</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Avg. Sell Price</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">$461K</dd>
        </div>
      </div>

      <EventPerformanceReport />
    </div>
  );
};

export default Reports;
