import { IconCheck, IconX, IconClockHour4, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const ledgerData = [
  { id: 'TXN-001', type: 'Player Purchase', amount: '$2,400,000', player: 'Virat Kohli', event: 'IPL Mega Auction 2024', status: 'Success', date: 'Oct 20, 2024' },
  { id: 'TXN-002', type: 'Player Purchase', amount: '$1,800,000', player: 'Rashid Khan', event: 'IPL Mega Auction 2024', status: 'Success', date: 'Oct 20, 2024' },
  { id: 'TXN-003', type: 'Event Entry Fee', amount: '$50,000', player: '-', event: 'IPL Mega Auction 2024', status: 'Success', date: 'Oct 15, 2024' },
  { id: 'TXN-004', type: 'Purse Top-up', amount: '$10,000,000', player: '-', event: 'Bank Transfer', status: 'Success', date: 'Oct 10, 2024', isCredit: true },
];

const FranchiseLedger = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Transaction Ledger</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date & ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {ledgerData.map((item) => (
              <tr key={item.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-secondary-900 dark:text-white">{item.date}</div>
                  <div className="text-xs text-secondary-500">{item.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white font-medium">{item.type}</div>
                  <div className="text-xs text-secondary-500">{item.event} {item.player !== '-' && `• ${item.player}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className={`flex items-center gap-1 text-sm font-bold ${item.isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                     {item.isCredit ? <IconArrowDownRight size={16} /> : <IconArrowUpRight size={16} />}
                     {item.amount}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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
