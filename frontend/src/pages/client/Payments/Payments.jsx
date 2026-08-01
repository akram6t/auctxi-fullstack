import WalletOverview from './components/WalletOverview';
import FranchiseLedger from './components/FranchiseLedger';

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            Wallet & Billing
          </h1>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
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
