import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import Sub-components (Assuming these exist based on your folder structure)
import AdminAnalytics from './AdminAnalytics';
import CompanyManagement from './CompanyManagement';
import DriveManagement from './DriveManagement';
import PendingApprovals from './PendingApprovals';

// Fallback components in case the real ones have import errors
const Placeholder = ({ title }) => <div className="p-4 bg-white rounded shadow">Placeholder for {title}</div>;

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AdminAnalytics /> || <Placeholder title="Analytics" />;
      case 'companies':
        return <CompanyManagement /> || <Placeholder title="Company Management" />;
      case 'drives':
        return <DriveManagement /> || <Placeholder title="Drive Management" />;
      case 'approvals':
        return <PendingApprovals /> || <Placeholder title="Pending Approvals" />;
      default:
        return <AdminAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700">
          Admin Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'companies' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Manage Companies
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'drives' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Placement Drives
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'approvals' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Pending Approvals
          </button>
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <div className="mb-2 text-sm text-indigo-200">Logged in as {user?.name}</div>
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;