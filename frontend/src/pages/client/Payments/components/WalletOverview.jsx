import { IconWallet, IconCreditCard, IconReceipt, IconX, IconLoader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../../../utils/api';

const WalletOverview = () => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user?.email) return;
      try {
        const res = await api.get('/teams');
        const myTeam = res.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
        if (myTeam) {
          setTeamData(myTeam);
        }
      } catch (err) {
        console.error('Failed to fetch team data:', err);
      }
    };
    fetchTeam();
  }, [user]);

  const purse = teamData?.purse || '0';
  const purseNumber = parseFloat(purse.toString().replace(/[^0-9.-]+/g,"") || 0);
  const totalCapacity = 100000000;
  const spentSoFar = Math.max(0, totalCapacity - purseNumber);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!teamData) {
      toast.error('Please create your Team Profile first before topping up your wallet.');
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // 1. Get Razorpay Config Key from Backend
      const configRes = await api.get('/payments/config');
      const rzpKeyId = configRes.data.keyId;

      if (!rzpKeyId) {
        throw new Error("Razorpay Key ID is missing from backend configuration.");
      }

      // 2. Create Order in .NET Backend
      const orderRes = await api.post('/payments/create-order', {
        amount: parseFloat(amount)
      });
      const orderId = orderRes.data.orderId;

      // 3. Initialize Razorpay Checkout
      const options = {
        key: rzpKeyId, // Dynamically fetched from .NET appsettings.json
        amount: parseFloat(amount) * 100, // Amount in paise
        currency: "INR",
        name: "AuctXI",
        description: "Wallet Top-up",
        order_id: orderId,
        prefill: {
          name: teamData?.ownerName || user?.name || "Franchise Owner",
          email: user?.email || ""
        },
        theme: {
          color: "#4f46e5"
        },
        handler: async function (response) {
          try {
            // 4. Verify Payment in .NET Backend
            await api.post('/payments/verify', {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              amount: parseFloat(amount),
              teamName: teamData?.name || 'Unknown Team',
              ownerEmail: user?.email || ''
            });

            // 5. Update Team Purse in Java Backend
            if (teamData) {
              const newPurse = (purseNumber + parseFloat(amount)).toString();
              const updatedTeam = { ...teamData, purse: newPurse };
              await api.put(`/teams/${teamData.id}`, updatedTeam);
              setTeamData(updatedTeam);
            }

            toast.success(`Successfully added ${currencySymbol}${amount} to your purse!`);
            setShowModal(false);
            setAmount('');
            // Optional: Dispatch event to trigger FranchiseLedger refresh
            window.dispatchEvent(new Event('transaction-updated'));
          } catch (verifyError) {
            console.error('Verification failed:', verifyError);
            toast.error('Payment verification failed.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error(response.error);
        toast.error('Payment failed: ' + response.error.description);
      });
      
      rzp.open();

    } catch (err) {
      console.error('Order creation failed:', err);
      toast.error('Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatements = async () => {
    if (!teamData) return;
    
    try {
      toast.info("Generating statements...");
      const res = await api.get('/payments');
      const filtered = res.data.filter(txn => txn.teamName === teamData.name);
      
      if (filtered.length === 0) {
        toast.warning("No transactions found to download.");
        return;
      }
      
      const csvRows = [];
      const headers = ['ID', 'Date', 'Type', 'Amount', 'Status', 'Reference', 'Event', 'Player'];
      csvRows.push(headers.join(','));
      
      filtered.forEach(txn => {
        const row = [
          txn.id || '',
          new Date(txn.date).toLocaleDateString() || '',
          txn.type || '',
          txn.amount || '0',
          txn.status || '',
          txn.reference ? `"${txn.reference}"` : '',
          txn.eventName || '',
          txn.playerName || ''
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${teamData.name.replace(/\s+/g, '_')}_Statements.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Statements downloaded successfully!");
    } catch (err) {
      console.error("Failed to download statements", err);
      toast.error("Failed to download statements.");
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary-400 opacity-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-sm font-medium uppercase tracking-wider mb-1">Franchise Purse Balance</p>
              <h2 className="text-4xl font-black tracking-tight">{currencySymbol}{purseNumber.toLocaleString()}</h2>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IconWallet size={32} />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20 flex gap-6">
            <div>
               <p className="text-primary-200 text-xs">Total Capacity</p>
               <p className="font-semibold">{currencySymbol}{totalCapacity.toLocaleString()}</p>
            </div>
            <div>
               <p className="text-primary-200 text-xs">Spent So Far</p>
               <p className="font-semibold">{currencySymbol}{spentSoFar.toLocaleString()}</p>
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
         <button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white font-medium rounded-lg transition-colors">
           <IconCreditCard size={20} /> Request Purse Top-up
         </button>
         <button onClick={handleDownloadStatements} className="w-full flex items-center justify-center gap-2 py-3 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 text-secondary-700 dark:text-secondary-300 font-medium rounded-lg transition-colors">
           <IconReceipt size={20} /> Download Statements
         </button>
      </div>
    </div>

    {/* Add Funds Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-secondary-200 dark:border-secondary-800">
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-800">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Top-up Wallet Purse</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>
          <form onSubmit={handleAddFunds} className="p-6">
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Amount to Add
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-secondary-500 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="appearance-none block w-full pl-8 pr-3 py-3 border border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow"
                  placeholder="e.g. 50000"
                  min="1"
                />
              </div>
              <p className="mt-2 text-xs text-secondary-500">
                You will be redirected to Razorpay securely. Test Mode is active.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <IconLoader2 size={16} className="animate-spin" /> : null}
                Proceed to Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default WalletOverview;
