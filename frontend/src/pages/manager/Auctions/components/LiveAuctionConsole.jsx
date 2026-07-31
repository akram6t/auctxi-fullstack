import { useState, useEffect } from 'react';
import { IconArrowLeft, IconGavel, IconClock, IconTrophy, IconUserOff, IconPlayerPlay } from '@tabler/icons-react';
import { useSettings } from '../../../../context/SettingsContext';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';
import SoldPlayersHistory from '../../../../components/auction/SoldPlayersHistory';

const LiveAuctionConsole = ({ auctionId, onExit }) => {
  const { currencySymbol } = useSettings();
  const [auctionState, setAuctionState] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // For when no player is active
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  // Fetch auction state every second
  useEffect(() => {
    let interval;
    const fetchState = async () => {
      try {
        const res = await api.get(`/live-auctions/${auctionId}`);
        setAuctionState(res.data);
        
        if (res.data.status === 'ACTIVE' && res.data.endTime) {
          const remaining = Math.max(0, Math.floor((res.data.endTime - Date.now()) / 1000));
          setTimeLeft(remaining);
        } else {
          setTimeLeft(0);
        }

        if (res.data.status === 'WAITING' || res.data.status === 'SOLD' || res.data.status === 'UNSOLD') {
            fetchPlayers();
        }
      } catch (err) {
        console.error('Error fetching live auction state', err);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, [auctionId]);

  const fetchPlayers = async () => {
    try {
        const res = await api.get('/players');
        // Filter players that are available (mock logic for demo)
        setAvailablePlayers(res.data.filter(p => p.status !== 'Sold'));
    } catch (err) {
        console.error(err);
    }
  };

  const handleStartAuction = async () => {
    if (!selectedPlayerId) return toast.error('Please select a player first');
    try {
        await api.post(`/live-auctions/${auctionId}/start-player/${selectedPlayerId}`);
        toast.success('Auction started!');
        setSelectedPlayerId('');
    } catch (err) {
        console.error(err);
        toast.error('Failed to start auction: ' + (err.response?.data?.message || err.response?.data || err.message));
    }
  };

  const handleAction = async (type) => {
    try {
      if (type === 'sell') {
        await api.post(`/live-auctions/${auctionId}/sell`);
        toast.success('Player Sold!');
      } else {
        await api.post(`/live-auctions/${auctionId}/unsold`);
        toast.warning('Player Unsold!');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center">Connecting to Live Auction...</div>;

  const isIdle = !auctionState || auctionState.status === 'WAITING' || auctionState.status === 'SOLD' || auctionState.status === 'UNSOLD';

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
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${!isIdle ? 'bg-green-400' : 'bg-secondary-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${!isIdle ? 'bg-green-500' : 'bg-secondary-500'}`}></span>
              </span>
              Event ID: {auctionId}
            </h2>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">Live Management Console</p>
          </div>
        </div>
        
        {!isIdle && (
            <div className="flex items-center gap-6">
            <div className="text-center">
                <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold">Current Bid</p>
                <p className="text-2xl font-black text-primary-600 dark:text-primary-400">
                    {currencySymbol}{auctionState.currentBid?.toLocaleString() || 0}
                </p>
            </div>
            <div className="text-center">
                <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold">Highest Bidder</p>
                <p className="text-lg font-bold text-secondary-900 dark:text-white">
                    {auctionState.highestBidderTeamName || 'None'}
                </p>
            </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player on the Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden relative min-h-[400px] flex flex-col justify-center">
            
            {isIdle ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-6">
                        <IconGavel size={40} className="text-secondary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">No Active Auction</h2>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md">
                        Select a player from the list below to start the bidding process.
                    </p>
                    
                    <div className="flex gap-4 w-full max-w-md">
                        <select 
                            className="flex-1 rounded-lg border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white p-3 border bg-white text-secondary-900"
                            value={selectedPlayerId}
                            onChange={(e) => setSelectedPlayerId(e.target.value)}
                        >
                            <option value="">-- Select Player --</option>
                            {availablePlayers.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - {currencySymbol}{p.basePrice}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleStartAuction}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                            <IconPlayerPlay size={20} /> Start
                        </button>
                    </div>
                </div>
            ) : (
                <>
                <div className="absolute top-4 right-4 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Live
                </div>
                
                <div className="p-8 flex flex-col items-center">
                {auctionState.currentPlayer?.imageUrl ? (
                    <img src={auctionState.currentPlayer.imageUrl} alt={auctionState.currentPlayer.name} className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-secondary-900 shadow-lg mb-6" />
                ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-800 border-4 border-white dark:border-secondary-900 shadow-lg flex items-center justify-center text-4xl mb-6">
                        🏏
                    </div>
                )}
                
                <h1 className="text-3xl font-black text-secondary-900 dark:text-white mb-2">{auctionState.currentPlayer?.name}</h1>
                <div className="flex gap-4 text-secondary-600 dark:text-secondary-300 text-sm mb-6">
                    <span className="flex items-center gap-1"><IconTrophy size={16} /> {auctionState.currentPlayer?.role}</span>
                    <span>•</span>
                    <span>Base Price: {currencySymbol}{auctionState.currentPlayer?.basePrice}</span>
                    <span>•</span>
                    <span>{auctionState.currentPlayer?.country}</span>
                </div>
                
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
                </div>
                
                {/* Auction Controls */}
                <div className="bg-secondary-50 dark:bg-secondary-800/80 p-6 flex justify-center gap-4 border-t border-secondary-200 dark:border-secondary-800">
                <button 
                    onClick={() => handleAction('unsold')}
                    className="flex-1 max-w-[200px] py-3 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                    <IconUserOff size={20} /> Unsold
                </button>
                <button 
                    onClick={() => handleAction('sell')}
                    className="flex-1 max-w-[200px] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-colors flex justify-center items-center gap-2"
                >
                    <IconGavel size={20} /> Sell Player
                </button>
                </div>
                </>
            )}
          </div>
        </div>

        {/* Right Column: Bid History & Franchises */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 h-full min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 border-b border-secondary-200 dark:border-secondary-800 pb-2">Live Bids</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {!auctionState?.bids || auctionState.bids.length === 0 ? (
                  <div className="text-center text-secondary-500 mt-10">No bids yet</div>
              ) : (
                auctionState.bids.map((bid, i) => (
                    <div key={i} className={`p-3 rounded-lg flex justify-between items-center ${i === 0 ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50' : 'bg-secondary-50 dark:bg-secondary-800/50'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400'}`}>
                        <IconGavel size={16} />
                        </div>
                        <div>
                        <p className={`text-sm font-bold ${i === 0 ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>{bid.teamName}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            {new Date(bid.timestamp).toLocaleTimeString()}
                        </p>
                        </div>
                    </div>
                    <p className={`font-mono font-bold ${i === 0 ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>
                        {currencySymbol}{bid.amount.toLocaleString()}
                    </p>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <SoldPlayersHistory />
      </div>
    </div>
  );
};

export default LiveAuctionConsole;
