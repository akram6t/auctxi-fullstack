import { useState, useEffect } from 'react';
import { IconArrowLeft, IconArrowUpRight, IconClock, IconTrophy, IconWallet, IconCheck } from '@tabler/icons-react';

const BiddingTerminal = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentBid, setCurrentBid] = useState(2400000);
  const [bidStatus, setBidStatus] = useState(null); // 'success', 'processing'
  const [isHighestBidder, setIsHighestBidder] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleBid = () => {
    setBidStatus('processing');
    setTimeout(() => {
      setCurrentBid(prev => prev + 100000);
      setTimeLeft(15); // Reset timer on bid
      setBidStatus('success');
      setIsHighestBidder(true);
      
      setTimeout(() => setBidStatus(null), 2000);
    }, 600);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

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
          <div className="text-right flex items-center gap-3 bg-secondary-50 dark:bg-secondary-800/50 p-2 rounded-lg border border-secondary-200 dark:border-secondary-700">
            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-md">
              <IconWallet size={24} />
            </div>
            <div>
              <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold">Your Purse</p>
              <p className="text-xl font-black text-secondary-900 dark:text-white">$4,500,000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player on the Block & Bidding */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden relative">
            <div className="absolute top-4 right-4 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Lot #4
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-800 border-4 border-white dark:border-secondary-900 shadow-lg flex items-center justify-center text-4xl mb-6">
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
              
              <div className={`w-full max-w-md rounded-xl p-6 flex items-center justify-between border mb-8 transition-colors ${isHighestBidder ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800/50' : 'bg-secondary-50 border-secondary-200 dark:bg-secondary-800/50 dark:border-secondary-700'}`}>
                 <div>
                   <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">Highest Bidder</p>
                   <p className={`text-xl font-bold ${isHighestBidder ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                     {isHighestBidder ? 'You (Current)' : 'Mumbai Indians'}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">Current Bid</p>
                   <p className="text-2xl font-black text-primary-600 dark:text-primary-400">{formatCurrency(currentBid)}</p>
                 </div>
              </div>

              {/* Action Button */}
              {timeLeft <= 0 ? (
                <div className="w-full max-w-md py-4 bg-secondary-100 text-secondary-500 dark:bg-secondary-800 font-black text-xl rounded-xl text-center">
                  Auction Closed
                </div>
              ) : (
                <button 
                  onClick={handleBid}
                  disabled={bidStatus === 'processing' || isHighestBidder}
                  className={`w-full max-w-md py-4 text-white font-black text-xl rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
                    isHighestBidder 
                      ? 'bg-secondary-400 cursor-not-allowed shadow-none' 
                      : bidStatus === 'success'
                        ? 'bg-green-500 shadow-green-500/20'
                        : 'bg-green-600 hover:bg-green-700 shadow-green-600/20 transform hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {bidStatus === 'processing' ? (
                    'Processing...'
                  ) : bidStatus === 'success' ? (
                    <><IconCheck size={24} /> Bid Placed!</>
                  ) : isHighestBidder ? (
                    'You are the highest bidder'
                  ) : (
                    <><IconArrowUpRight size={24} /> Bid {formatCurrency(currentBid + 100000)}</>
                  )}
                </button>
              )}
              
              {!isHighestBidder && timeLeft > 0 && (
                <p className="text-xs text-secondary-500 mt-3 text-center">Next increment: $100,000. You have sufficient funds.</p>
              )}
            </div>
            
          </div>
        </div>

        {/* Right Column: Timer & History */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center border-b-4 border-b-primary-500">
             <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Time Remaining</p>
             <p className={`text-6xl font-black font-mono flex items-center justify-center gap-3 ${timeLeft <= 5 && timeLeft > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-secondary-900 dark:text-white'}`}>
               <IconClock size={40} className={timeLeft <= 5 && timeLeft > 0 ? 'text-red-500' : 'text-primary-500'} />
               00:{timeLeft.toString().padStart(2, '0')}
             </p>
          </div>

          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 h-[250px] flex flex-col">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 border-b border-secondary-200 dark:border-secondary-800 pb-2">Live Bids</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {isHighestBidder && (
                <div className="p-3 rounded-lg flex justify-between items-center bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50">
                  <div>
                    <p className="text-sm font-bold text-primary-700 dark:text-primary-400">You</p>
                    <p className="text-xs text-secondary-500">Just now</p>
                  </div>
                  <p className="font-mono font-bold text-primary-700 dark:text-primary-400">{formatCurrency(currentBid)}</p>
                </div>
              )}
              {[
                { team: 'Mumbai Indians', amount: '$2,400,000', time: '10s ago', me: false },
                { team: 'Chennai Super Kings', amount: '$2,350,000', time: '15s ago', me: false },
                { team: 'Mumbai Indians', amount: '$2,300,000', time: '25s ago', me: false },
                { team: 'Delhi Capitals', amount: '$2,200,000', time: '40s ago', me: false },
              ].map((bid, i) => (
                <div key={i} className={`p-3 rounded-lg flex justify-between items-center bg-secondary-50 dark:bg-secondary-800/50`}>
                  <div>
                    <p className={`text-sm font-bold text-secondary-900 dark:text-white`}>{bid.team}</p>
                    <p className="text-xs text-secondary-500">{bid.time}</p>
                  </div>
                  <p className={`font-mono font-bold text-secondary-700 dark:text-secondary-300`}>{bid.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BiddingTerminal;
