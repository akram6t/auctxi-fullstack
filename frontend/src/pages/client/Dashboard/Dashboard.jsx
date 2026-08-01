import ClientStatCards from './components/ClientStatCards';
import MySquadWidget from './components/MySquadWidget';
import UpcomingAuctionsWidget from './components/UpcomingAuctionsWidget';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
            Franchise Dashboard
          </h1>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
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
