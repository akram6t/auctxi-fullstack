import StatCards from './components/StatCards';
import RevenueChart from './components/RevenueChart';
import RecentActivityTable from './components/RecentActivityTable';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

const Dashboard = () => {
  const generateReport = async () => {
    try {
      const toastId = toast.loading('Generating report...');
      
      // Fetch fresh data for the report
      const statsRes = await api.get('/dashboard/stats');
      const actRes = await api.get('/dashboard/activities');
      
      const stats = statsRes.data;
      const activities = actRes.data;
      
      let csvContent = "AuctXI System Overview Report\n";
      csvContent += `Generated at: ${new Date().toLocaleString()}\n\n`;
      
      csvContent += "--- Key Metrics ---\n";
      csvContent += `Total Teams,${stats.totalTeams}\n`;
      csvContent += `Total Players,${stats.totalPlayers}\n`;
      csvContent += `Total Users,${stats.totalUsers}\n\n`;
      
      csvContent += "--- Recent Activity ---\n";
      csvContent += "Time,Type,Description\n";
      activities.forEach(act => {
        csvContent += `"${new Date(act.time).toLocaleString()}","${act.type}","${act.description.replace(/"/g, '""')}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `auctxi_system_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.update(toastId, { render: "Report generated successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Failed to generate report", error);
      toast.error('Failed to generate report. Please try again.');
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Overview of your auction system metrics and recent activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={generateReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col p-6 text-white relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
            <h3 className="text-lg font-semibold mb-2">Next Auction</h3>
            <p className="text-3xl font-bold mb-1">IPL Mega 2024</p>
            <p className="text-primary-100 text-sm mb-6">Starts in 3 days, 14 hours</p>
            
            <div className="mt-auto">
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Teams Ready</span>
                <span className="font-semibold">8/10</span>
              </div>
              <div className="w-full bg-primary-900/50 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <Link to="/admin/auctions" className="mt-6 w-full bg-white text-primary-700 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors text-center inline-block">
                Manage Auction
              </Link>
            </div>
          </div>
        </div>
      </div>

      <RecentActivityTable />
    </div>
  );
};

export default Dashboard;
