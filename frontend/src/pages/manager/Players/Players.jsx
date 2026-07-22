import AuctionPlayerList from './components/AuctionPlayerList';

const Players = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Player Pool
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            View the pool of players available for your assigned auctions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Pool Size</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">470</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Remaining</dt>
          <dd className="mt-1 text-3xl font-semibold text-blue-600">350</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Sold</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">120</dd>
        </div>
      </div>

      <AuctionPlayerList />
    </div>
  );
};

export default Players;
