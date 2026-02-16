import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import Sub-components
import AdminAnalytics from './AdminAnalytics';
import CompanyManagement from './CompanyManagement';
import DriveManagement from './DriveManagement';
import PendingApprovals from './PendingApprovals';

// Fallback components
const Placeholder = ({ title }) => <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">Placeholder for {title}</div>;

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminAnalytics /> || <Placeholder title="Dashboard" />;
      case 'companies':
        return <CompanyManagement /> || <Placeholder title="Companies" />;
      case 'drives':
        return <DriveManagement /> || <Placeholder title="Drives" />;
      case 'experiences':
        return <Placeholder title="Experiences" />; // Future exp management
      case 'approvals':
        return <PendingApprovals /> || <Placeholder title="Approvals" />;
      case 'analytics':
        return <AdminAnalytics /> || <Placeholder title="Analytics" />;
      default:
        return <AdminAnalytics />;
    }
  };

  const NavItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1
        ${activeTab === id
          ? 'bg-slate-800 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            🎓
          </div>
          <span className="text-xl font-bold tracking-tight">PlaceIQ</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <NavItem id="dashboard" icon="Rx" label="Dashboard" /> {/* Using Rx as generic icon placeholder till we import proper ones or use emoji */}
          <NavItem id="companies" icon="🏢" label="Companies" />
          <NavItem id="drives" icon="📢" label="Drives" />
          <NavItem id="experiences" icon="📄" label="Experiences" />
          <NavItem id="approvals" icon="✅" label="Approvals" />
          <NavItem id="analytics" icon="📊" label="Analytics" />
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'Admin'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <span className="text-lg">↪️</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;