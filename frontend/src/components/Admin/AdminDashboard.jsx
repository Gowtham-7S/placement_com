import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Campaign as CampaignIcon,
  Article as ArticleIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import AdminAnalytics from './AdminAnalytics';
import AdminAnalyticsPage from './AdminAnalyticsPage';
import AdminExperienceManagement from './AdminExperienceManagement';
import CompanyManagement from './CompanyManagement';
import DriveManagement from './DriveManagement';
import PendingApprovals from './PendingApprovals';



const PAGE_TITLES = {
  dashboard: 'Dashboard Overview',
  companies: 'Company Management',
  drives: 'Placement Drives',
  experiences: 'Experiences',
  approvals: 'Pending Approvals',
  analytics: 'Analytics',
};

const NAV_ITEMS = [
  { id: 'dashboard', icon: <DashboardIcon fontSize="small" />, label: 'Dashboard' },
  { id: 'companies', icon: <BusinessIcon fontSize="small" />, label: 'Companies' },
  { id: 'drives', icon: <CampaignIcon fontSize="small" />, label: 'Drives' },
  { id: 'experiences', icon: <ArticleIcon fontSize="small" />, label: 'Experiences' },
  { id: 'approvals', icon: <CheckCircleIcon fontSize="small" />, label: 'Approvals' },
  { id: 'analytics', icon: <BarChartIcon fontSize="small" />, label: 'Analytics' },
];

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
      case 'dashboard': return <AdminAnalytics />;
      case 'companies': return <CompanyManagement />;
      case 'drives': return <DriveManagement />;
      case 'experiences': return <AdminExperienceManagement />;
      case 'approvals': return <PendingApprovals />;
      case 'analytics': return <AdminAnalyticsPage />;
      default: return <AdminAnalytics />;
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            🎓
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">PlaceIQ</span>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-slate-700/80 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
                )}
                <span className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                  {icon}
                </span>
                {label}
                {id === 'approvals' && (
                  <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">!</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer — Logout only */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg text-sm font-medium transition-all duration-150"
          >
            <LogoutIcon fontSize="small" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {PAGE_TITLES[activeTab]}
            </h2>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative">
              <NotificationsIcon fontSize="small" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-400 capitalize">{user?.role || 'admin'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;