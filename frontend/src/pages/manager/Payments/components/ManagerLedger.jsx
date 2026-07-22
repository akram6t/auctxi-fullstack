import { IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react';

const ledgerData = [
  { id: 'LDG-101', team: 'Chennai Super Kings', event: 'IPL Mega Auction 2024', type: 'Player Purchase', amount: '$2,400,000', player: 'Virat Kohli', status: 'Success' },
  { id: 'LDG-102', team: 'Mumbai Indians', event: 'IPL Mega Auction 2024', type: 'Player Purchase', amount: '$2,100,000', player: 'Jasprit Bumrah', status: 'Success' },
  { id: 'LDG-103', team: 'Delhi Capitals', event: 'IPL Mega Auction 2024', type: 'Player Purchase', amount: '$1,800,000', player: 'Rashid Khan', status: 'Pending' },
];

const ManagerLedger = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-semibold text-secondary-900 dark:text-white">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Team / Event</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-800">
            {ledgerData.map((item) => (
              <tr key={item.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-secondary-900 dark:text-white">{item.team}</div>
                  <div className="text-xs text-secondary-500">{item.event}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white">{item.type}</div>
                  <div className="text-xs text-secondary-500">{item.player}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-secondary-900 dark:text-white">
                  {item.amount}
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

export default ManagerLedger;
