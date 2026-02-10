import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 12,
    totalDrives: 8,
    pendingApprovals: 5,
    approvedExperiences: 34,
  });
  const [loading, setLoading] = useState(false);

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const quickActions = [
    { icon: '🏢', title: 'Manage Companies', path: '/admin/companies', color: '#3b82f6' },
    { icon: '📢', title: 'Manage Drives', path: '/admin/drives', color: '#8b5cf6' },
    { icon: '✅', title: 'Review Submissions', path: '/admin/approvals', color: '#10b981' },
    { icon: '📈', title: 'View Analytics', path: '/admin/analytics', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage companies, drives, and experience submissions</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalCompanies}</div>
          <div className="stat-label">Total Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalDrives}</div>
          <div className="stat-label">Active Drives</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.pendingApprovals}
          </div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.approvedExperiences}
          </div>
          <div className="stat-label">Approved Experiences</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="items-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="item-card"
              onClick={() => handleQuickAction(action.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="item-card-icon">{action.icon}</div>
              <div className="item-card-title">{action.title}</div>
              <div className="item-card-desc">Click to proceed →</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Activity</h2>
        <Card>
          <Card.Body>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              No recent activities to display
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
