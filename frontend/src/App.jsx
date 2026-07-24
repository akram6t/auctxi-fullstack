import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login/Login';
import Signup from './pages/auth/Signup/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard/Dashboard';
import AdminAuctions from './pages/admin/Auctions/Auctions';
import AdminTeams from './pages/admin/Teams/Teams';
import AdminTeamDetails from './pages/admin/Teams/TeamDetails';
import AdminPlayers from './pages/admin/Players/Players';
import AdminUsers from './pages/admin/Users/Users';
import AdminPayments from './pages/admin/Payments/Payments';
import AdminReports from './pages/admin/Reports/Reports';
import AdminSettings from './pages/admin/Settings/Settings';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard/Dashboard';
import ManagerAuctions from './pages/manager/Auctions/Auctions';
import ManagerPlayers from './pages/manager/Players/Players';
import ManagerPayments from './pages/manager/Payments/Payments';
import ManagerReports from './pages/manager/Reports/Reports';

// Client Pages
import ClientDashboard from './pages/client/Dashboard/Dashboard';
import ClientAuctions from './pages/client/Auctions/Auctions';
import ClientPlayers from './pages/client/Players/Players';
import ClientPayments from './pages/client/Payments/Payments';
import ClientProfile from './pages/client/Profile/Profile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="auctions" element={<AdminAuctions />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="teams/:id" element={<AdminTeamDetails />} />
              <Route path="players" element={<AdminPlayers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="auctions" element={<ManagerAuctions />} />
              <Route path="players" element={<ManagerPlayers />} />
              <Route path="payments" element={<ManagerPayments />} />
              <Route path="reports" element={<ManagerReports />} />
            </Route>
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/client" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="auctions" element={<ClientAuctions />} />
              <Route path="players" element={<ClientPlayers />} />
              <Route path="payments" element={<ClientPayments />} />
              <Route path="profile" element={<ClientProfile />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;
