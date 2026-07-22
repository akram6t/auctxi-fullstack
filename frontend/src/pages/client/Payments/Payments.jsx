import WalletOverview from './components/WalletOverview';
import FranchiseLedger from './components/FranchiseLedger';

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Wallet & Billing
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Manage your franchise purse, view transaction history, and download invoices.
          </p>
        </div>
      </div>

      <WalletOverview />
      <FranchiseLedger />
    </div>
  );
};

export default Payments;
