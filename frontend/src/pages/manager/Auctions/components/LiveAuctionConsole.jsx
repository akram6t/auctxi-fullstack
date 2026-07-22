import { useState, useEffect } from 'react';
import { IconArrowLeft, IconGavel, IconClock, IconTrophy, IconUserOff } from '@tabler/icons-react';

const LiveAuctionConsole = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0 || actionMessage) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, actionMessage]);

  const handleAction = (type) => {
    setActionMessage(type === 'sell' ? 'Player Sold!' : 'Player Unsold!');
    setTimeout(() => {
      onExit(); // Go back to list after action
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-4">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg text-secondary-500 transition-colors">
            <IconArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              IPL Mega Auction 2024
            </h2>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">Set 1: Marquee Batsmen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold">Current Bid</p>
            <p className="text-2xl font-black text-primary-600 dark:text-primary-400">$2,400,000</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold">Highest Bidder</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">Chennai Super Kings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player on the Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden relative">
            <div className="absolute top-4 right-4 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Lot #4
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-800 border-4 border-white dark:border-secondary-900 shadow-lg flex items-center justify-center text-4xl mb-6 transition-all duration-500">
                🏏
              </div>
              <h1 className="text-3xl font-black text-secondary-900 dark:text-white mb-2">Virat Kohli</h1>
              <div className="flex gap-4 text-secondary-600 dark:text-secondary-300 text-sm mb-6">
                <span className="flex items-center gap-1"><IconTrophy size={16} /> Batsman</span>
                <span>•</span>
                <span>Base Price: $1,000,000</span>
                <span>•</span>
                <span>India</span>
              </div>
              
              {actionMessage ? (
                <div className={`w-full max-w-md rounded-xl p-6 text-center border ${
                  actionMessage.includes('Sold') && !actionMessage.includes('Unsold') 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400'
                }`}>
                  <p className="text-3xl font-black animate-pulse">{actionMessage}</p>
                  <p className="text-sm mt-2 opacity-80">Loading next player...</p>
                </div>
              ) : (
                <div className={`w-full max-w-md rounded-xl p-6 text-center border transition-colors duration-300 ${
                  timeLeft <= 5 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' 
                    : 'bg-secondary-50 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700'
                }`}>
                   <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">Time Remaining</p>
                   <p className={`text-5xl font-black font-mono flex items-center justify-center gap-2 ${
                     timeLeft <= 5 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-secondary-900 dark:text-white'
                   }`}>
                     <IconClock size={32} className={timeLeft <= 5 ? 'text-red-500' : 'text-primary-500'} />
                     00:{timeLeft.toString().padStart(2, '0')}
                   </p>
                </div>
              )}
            </div>
            
            {/* Auction Controls */}
            <div className="bg-secondary-50 dark:bg-secondary-800/80 p-6 flex justify-center gap-4 border-t border-secondary-200 dark:border-secondary-800">
              <button 
                onClick={() => handleAction('unsold')}
                disabled={!!actionMessage}
                className="flex-1 max-w-[200px] py-3 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconUserOff size={20} /> Unsold
              </button>
              <button 
                onClick={() => handleAction('sell')}
                disabled={!!actionMessage}
                className="flex-1 max-w-[200px] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconGavel size={20} /> Sell Player
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Bid History & Franchises */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 border-b border-secondary-200 dark:border-secondary-800 pb-2">Live Bids</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {[
                { team: 'Chennai Super Kings', amount: '$2,400,000', time: 'Just now' },
                { team: 'Mumbai Indians', amount: '$2,350,000', time: '10s ago' },
                { team: 'Chennai Super Kings', amount: '$2,300,000', time: '25s ago' },
                { team: 'Delhi Capitals', amount: '$2,200,000', time: '40s ago' },
                { team: 'Mumbai Indians', amount: '$2,100,000', time: '1m ago' },
              ].map((bid, i) => (
                <div key={i} className={`p-3 rounded-lg flex justify-between items-center ${i === 0 ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50' : 'bg-secondary-50 dark:bg-secondary-800/50'}`}>
                  <div>
                    <p className={`text-sm font-bold ${i === 0 ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>{bid.team}</p>
                    <p className="text-xs text-secondary-500">{bid.time}</p>
                  </div>
                  <p className={`font-mono font-bold ${i === 0 ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>{bid.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LiveAuctionConsole;
