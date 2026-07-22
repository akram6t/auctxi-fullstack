import ClientStatCards from './components/ClientStatCards';
import MySquadWidget from './components/MySquadWidget';
import UpcomingAuctionsWidget from './components/UpcomingAuctionsWidget';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Franchise Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Welcome back! Here's an overview of your purse, squad, and upcoming events.
          </p>
        </div>
      </div>

      <ClientStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MySquadWidget />
        <UpcomingAuctionsWidget />
      </div>
    </div>
  );
};

export default Dashboard;
