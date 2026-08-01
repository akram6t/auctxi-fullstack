import ScoutingPlayerList from './components/ScoutingPlayerList';

const Players = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            Scouting & Shortlists
          </h1>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
            Browse the player catalog and build your target list for upcoming auctions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
        <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 px-6 py-6 text-center">
          <dt className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 truncate">Total Player Pool</dt>
          <dd className="mt-2 text-4xl font-black text-secondary-900 dark:text-white">470</dd>
        </div>
        <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 px-6 py-6 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <dt className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 truncate">Your Shortlist</dt>
          <dd className="mt-2 text-4xl font-black text-yellow-500 dark:text-yellow-400">24</dd>
        </div>
        <div className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 px-6 py-6 text-center col-span-2 flex items-center justify-center bg-gradient-to-br from-primary-500 to-blue-600 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10 text-left">
             <p className="text-sm font-black text-white/80 uppercase tracking-widest mb-1">Strategy Tip</p>
             <p className="text-lg font-bold text-white leading-tight">You need at least 3 more fast bowlers to meet squad requirements.</p>
           </div>
        </div>
      </div>

      <ScoutingPlayerList />
    </div>
  );
};

export default Players;
