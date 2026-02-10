import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = {
    admin: [
      { label: 'Dashboard', href: '/admin', icon: '📊' },
      { label: 'Companies', href: '/admin/companies', icon: '🏢' },
      { label: 'Drives', href: '/admin/drives', icon: '📢' },
      { label: 'Pending Approvals', href: '/admin/approvals', icon: '✅' },
      { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    ],
    student: [
      { label: 'Dashboard', href: '/student', icon: '📊' },
      { label: 'Submit Experience', href: '/student/submit-experience', icon: '✍️' },
      { label: 'My Experiences', href: '/student/experiences', icon: '📝' },
    ],
    junior: [
      { label: 'Dashboard', href: '/junior', icon: '📊' },
      { label: 'Browse Companies', href: '/junior/companies', icon: '🔍' },
      { label: 'Preparation Roadmap', href: '/junior/roadmap', icon: '🎯' },
    ],
  };

  const items = navItems[user?.role] || [];

  return (
    <div className={`sidebar ${isOpen ? 'active' : ''}`}>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <li key={item.href} className="sidebar-nav-item">
            <Link
              to={item.href}
              className={`sidebar-nav-link ${location.pathname === item.href ? 'active' : ''}`}
              onClick={onClose}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          </li>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
