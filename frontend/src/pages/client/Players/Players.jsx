import ScoutingPlayerList from './components/ScoutingPlayerList';

const Players = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Scouting & Shortlists
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Browse the player catalog and build your target list for upcoming auctions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Total Player Pool</dt>
          <dd className="mt-1 text-3xl font-semibold text-secondary-900 dark:text-white">470</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center">
          <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">Your Shortlist</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600 flex justify-center items-center gap-2">24</dd>
        </div>
        <div className="bg-white dark:bg-secondary-900 overflow-hidden shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 px-4 py-5 sm:p-6 text-center col-span-2 flex items-center justify-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/30">
           <div>
             <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Strategy Tip</p>
             <p className="text-xs text-primary-700 dark:text-primary-400 mt-1">You need at least 3 more fast bowlers to meet squad requirements.</p>
           </div>
        </div>
      </div>

      <ScoutingPlayerList />
    </div>
  );
};

export default Players;
