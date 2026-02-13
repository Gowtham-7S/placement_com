import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyExperiences from './MyExperiences';
import SubmitExperience from './SubmitExperience';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('experiences');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'experiences':
        return <MyExperiences />;
      case 'submit':
        return <SubmitExperience />;
      default:
        return <MyExperiences />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700">
          Student Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'experiences' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            My Experiences
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'submit' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            Submit Experience
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

export default StudentDashboard;