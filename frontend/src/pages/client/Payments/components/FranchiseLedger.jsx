import { IconDownload, IconArrowUpRight, IconArrowDownRight, IconClockHour4, IconCheck, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';

const FranchiseLedger = () => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) return;
        const teamRes = await api.get('/teams');
        const myTeam = teamRes.data.find(t => t.ownerEmail?.toLowerCase() === user.email?.toLowerCase());
        
        if (!myTeam) {
            setLoading(false);
            return;
        }

        const res = await api.get('/payments');
        // Filter by our team name
        const filtered = res.data.filter(txn => txn.teamName === myTeam.name);
        
        const mapped = filtered.map(txn => ({
            id: txn.reference || 'TXN-' + txn.id.toString().padStart(4, '0'),
            type: txn.type || 'Player Purchase',
            amount: parseFloat(txn.amount || 0).toLocaleString(),
            player: txn.playerName || '-',
            event: txn.eventName || 'Event',
            status: txn.status || 'Success',
            date: new Date(txn.date).toLocaleDateString(),
            isCredit: txn.type === 'Purse Top-up'
        }));
        // Sort newest first
        setLedgerData(mapped.reverse());
      } catch (err) {
        console.error("Failed to load ledger", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    window.addEventListener('transaction-updated', fetchData);
    return () => {
      window.removeEventListener('transaction-updated', fetchData);
    };
  }, [user]);
  return (
    <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/40 dark:border-secondary-800/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200/50 dark:border-secondary-800/50 flex justify-between items-center bg-white/50 dark:bg-secondary-900/50">
        <h3 className="text-lg leading-6 font-bold text-secondary-900 dark:text-white">Transaction Ledger</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50/50 dark:bg-secondary-800/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date & ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800/50">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-secondary-500">
                  Loading transactions...
                </td>
              </tr>
            ) : ledgerData.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-secondary-500">
                  No transactions found.
                </td>
              </tr>
            ) : ledgerData.map((item) => (
              <tr key={item.id} className="hover:bg-secondary-50/80 dark:hover:bg-secondary-800/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-secondary-900 dark:text-white">{item.date}</div>
                  <div className="text-xs text-secondary-500">{item.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white font-bold">{item.type}</div>
                  <div className="text-xs font-medium text-secondary-500 mt-0.5">{item.event} {item.player !== '-' && `• ${item.player}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className={`flex items-center gap-1 text-sm font-bold ${item.isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                     {item.isCredit ? <IconArrowDownRight size={16} /> : <IconArrowUpRight size={16} />}
                     {item.isCredit ? '+' : '-'}{currencySymbol}{item.amount}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-[10px] leading-4 font-bold rounded-full uppercase tracking-wider ${
                    item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                  }`}>
                    {item.status === 'Success' && <IconCheck size={12} />}
                    {item.status === 'Pending' && <IconClockHour4 size={12} />}
                    {item.status === 'Failed' && <IconX size={12} />}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FranchiseLedger;
