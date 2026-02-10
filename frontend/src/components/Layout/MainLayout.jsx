import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <div className="main-navbar">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="main-content">
        <div className="main-sidebar">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="main-area">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
