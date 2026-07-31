import { useState, useEffect } from 'react';
import { IconArrowLeft, IconGavel, IconClock, IconTrophy, IconWallet, IconCheck, IconArrowUpRight } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import SoldPlayersHistory from '../../../../components/auction/SoldPlayersHistory';

const BiddingTerminal = ({ auctionId, onExit }) => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  
  const [auctionState, setAuctionState] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [bidIncrement, setBidIncrement] = useState(100000);

  const fetchTeam = async () => {
      if (!user?.email) return;
      try {
          const res = await api.get('/teams');
          let team = res.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
          if (team) {
              setMyTeam(team);
          } else {
              console.log("No team found, auto-creating one for testing...");
              const newTeamRes = await api.post('/teams', {
                  name: `Team ${user.email.split('@')[0]}`,
                  ownerEmail: user.email,
                  purse: "100000000",
                  status: "Active",
                  squadSize: 0
              });
              setMyTeam(newTeamRes.data);
          }
      } catch (err) {
          console.error('Failed to fetch team', err);
          setMyTeam(null);
      }
  };

  useEffect(() => {
      fetchTeam();
  }, [user]);

  // Refetch team to update purse when auction state becomes SOLD
  useEffect(() => {
      if (auctionState?.status === 'SOLD') {
          fetchTeam();
      }
  }, [auctionState?.status]);

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

  const handleBid = async (amount = null) => {
    if (!auctionState || auctionState.status !== 'ACTIVE') return;
    
    const increment = amount || bidIncrement;
    const nextBid = auctionState.currentBid + increment;
    
    // Validate team and purse
    if (!myTeam) {
        toast.error("No team associated with your account.");
        return;
    }
    
    const purseNumber = parseFloat((myTeam.purse || '0').replace(/[^0-9.]/g, '')) * 1000000;
    if (nextBid > purseNumber) {
        toast.error("Insufficient purse for this bid!");
        return;
    }

    setBidding(true);
    try {
        await api.post(`/live-auctions/${auctionId}/bid`, {
            teamId: myTeam.id,
            amount: nextBid
        });
        toast.success('Bid placed successfully!');
    } catch (err) {
        toast.error('Failed to place bid. ' + (err.response?.data?.message || err.message));
    } finally {
        setBidding(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val).replace('$', currencySymbol);

  if (loading) return <div className="p-8 text-center">Connecting to Live Auction...</div>;

  const isIdle = !auctionState || auctionState.status === 'WAITING';
  const isSold = auctionState?.status === 'SOLD';
  const isUnsold = auctionState?.status === 'UNSOLD';
  
  const isHighestBidder = myTeam ? (auctionState?.highestBidderTeamId === myTeam.id) : false;

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
            <p className="text-xs text-secondary-500 dark:text-secondary-400">Franchise Terminal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-md">
              <IconWallet size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold mb-1">Remaining Purse</p>
              <p className="text-xl font-black text-secondary-900 dark:text-white">
                  {currencySymbol}{myTeam ? (myTeam.purse || '0') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player and Bidding Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden relative min-h-[400px]">
            {isIdle ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <IconClock size={64} className="text-secondary-300 mb-6" />
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Waiting for Manager</h2>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md">
                        The auctioneer has not started bidding on a player yet. Please wait.
                    </p>
                </div>
            ) : isSold ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    {isHighestBidder ? (
                        <>
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                                <IconCheck size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">PLAYER SECURED!</h2>
                            <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-6">
                                Congratulations! You have successfully bought <span className="font-bold text-secondary-900 dark:text-white">{auctionState.currentPlayer?.name}</span>.
                            </p>
                            <div className="bg-secondary-50 dark:bg-secondary-800/50 p-6 rounded-xl border border-secondary-200 dark:border-secondary-700 w-full max-w-md flex flex-col items-center">
                                {auctionState.currentPlayer?.imageUrl ? (
                                    <img src={auctionState.currentPlayer.imageUrl} alt={auctionState.currentPlayer.name} className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-secondary-700 shadow-sm mb-4" />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-secondary-200 dark:bg-secondary-700 border-4 border-white dark:border-secondary-700 flex items-center justify-center text-3xl mb-4">
                                        🏏
                                    </div>
                                )}
                                <p className="text-sm text-secondary-500 uppercase tracking-wider font-bold mb-1">Winning Bid</p>
                                <p className="text-3xl font-black text-primary-600 dark:text-primary-400">{currencySymbol}{auctionState.currentBid?.toLocaleString()}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-6">
                                <IconGavel size={40} className="text-secondary-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Player Sold</h2>
                            <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                                <span className="font-bold text-secondary-900 dark:text-white">{auctionState.currentPlayer?.name}</span> was sold to <span className="font-bold text-primary-600">{auctionState.highestBidderTeamName}</span>.
                            </p>
                            <div className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-xl border border-secondary-200 dark:border-secondary-700">
                                <p className="text-sm text-secondary-500 uppercase tracking-wider font-bold mb-1">Final Price</p>
                                <p className="text-xl font-bold text-secondary-900 dark:text-white">{currencySymbol}{auctionState.currentBid?.toLocaleString()}</p>
                            </div>
                        </>
                    )}
                </div>
            ) : isUnsold ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-800/50">
                        <IconClock size={48} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Player Unsold</h2>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md">
                        <span className="font-bold text-secondary-900 dark:text-white">{auctionState.currentPlayer?.name}</span> went unsold in this round.
                    </p>
                </div>
            ) : (
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
                    
                    <div className={`w-full max-w-md rounded-xl p-6 flex items-center justify-between border mb-8 transition-colors ${isHighestBidder ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800/50' : 'bg-secondary-50 border-secondary-200 dark:bg-secondary-800/50 dark:border-secondary-700'}`}>
                        <div>
                        <p className="text-xs text-secondary-500 uppercase tracking-wider font-bold mb-1">Current Bid</p>
                        <p className={`text-xl font-bold ${isHighestBidder ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                            {currencySymbol}{auctionState.currentBid?.toLocaleString()}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-xs text-secondary-500 uppercase tracking-wider font-bold mb-1">Highest Bidder</p>
                        <p className={`text-lg font-bold ${isHighestBidder ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                            {isHighestBidder ? 'YOU' : (auctionState.highestBidderTeamName || 'None')}
                        </p>
                        </div>
                    </div>
                    
                    <div className="w-full max-w-md space-y-4">
                        <div className="flex gap-2 mb-2">
                            {[100000, 200000, 500000].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setBidIncrement(amount)}
                                    disabled={isHighestBidder || timeLeft <= 0}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                        bidIncrement === amount 
                                        ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-500' 
                                        : 'bg-white text-secondary-600 border-secondary-200 hover:bg-secondary-50 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700'
                                    } ${(isHighestBidder || timeLeft <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    +{amount / 100000}L
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => handleBid(bidIncrement)}
                            disabled={isHighestBidder || timeLeft <= 0 || bidding}
                            className={`w-full py-4 text-white font-black text-xl rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
                                isHighestBidder 
                                ? 'bg-primary-500 cursor-not-allowed opacity-90' 
                                : timeLeft <= 0
                                    ? 'bg-secondary-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-500 hover:shadow-green-500/30 shadow-green-600/20 hover:-translate-y-1'
                            }`}
                        >
                        <IconGavel size={24} />
                        {isHighestBidder ? 'Waiting for higher bid...' : `BID ${currencySymbol}${(auctionState.currentBid + bidIncrement).toLocaleString()}`}
                        </button>
                        {!isHighestBidder && timeLeft > 0 && (
                            <p className="text-xs text-secondary-500 text-center">You have sufficient funds.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
          
          <SoldPlayersHistory />
        </div>

        {/* Right Column: Timer & History */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 flex flex-col items-center justify-center">
             <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Time Remaining</p>
             <p className={`text-6xl font-black font-mono flex items-center justify-center gap-3 ${timeLeft <= 5 && timeLeft > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-secondary-900 dark:text-white'}`}>
               <IconClock size={48} className={timeLeft <= 5 && timeLeft > 0 ? 'text-red-500' : 'text-primary-500'} />
               00:{timeLeft.toString().padStart(2, '0')}
             </p>
          </div>

          <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 h-[250px] flex flex-col">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 border-b border-secondary-200 dark:border-secondary-800 pb-2">Live Bids</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {!auctionState?.bids || auctionState.bids.length === 0 ? (
                  <div className="text-center text-secondary-500 mt-10">No bids yet</div>
              ) : (
                auctionState.bids.map((bid, i) => {
                    const isMyBid = myTeam && bid.teamId === myTeam.id;
                    return (
                        <div key={i} className={`p-3 rounded-lg flex justify-between items-center ${isMyBid ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50' : 'bg-secondary-50 dark:bg-secondary-800/50'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isMyBid ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400'}`}>
                            <IconGavel size={16} />
                            </div>
                            <div>
                            <p className={`text-sm font-bold ${isMyBid ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                                {isMyBid ? 'YOU' : bid.teamName}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                {new Date(bid.timestamp).toLocaleTimeString()}
                            </p>
                            </div>
                        </div>
                        <p className={`font-mono font-bold ${isMyBid ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            {currencySymbol}{bid.amount.toLocaleString()}
                        </p>
                        </div>
                    );
                })
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BiddingTerminal;
