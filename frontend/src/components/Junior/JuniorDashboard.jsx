import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CompanyBrowser from './CompanyBrowser';
import PreparationRoadmap from './PreparationRoadmap';

const JuniorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'companies':
        return <CompanyBrowser />;
      case 'roadmap':
        return <PreparationRoadmap />;
      default:
        return <CompanyBrowser />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700">
          Junior Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'companies' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Browse Companies
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'roadmap' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Preparation Roadmap
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

export default JuniorDashboard;