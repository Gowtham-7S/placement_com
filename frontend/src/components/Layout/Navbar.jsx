import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <button
          className="navbar-toggle"
          onClick={onToggleSidebar}
          title="Toggle Menu"
        >
          ☰
        </button>
        <span className="navbar-logo">📊</span>
        <span>Placement Portal</span>
      </div>

      <div className="navbar-user">
        <div>
          <div className="navbar-user-name">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="navbar-user-role">{user?.role}</div>
        </div>
        <Button
          label="Logout"
          onClick={handleLogout}
          variant="outline"
          size="small"
        />
      </div>
    </div>
  );
};

export default Navbar;
