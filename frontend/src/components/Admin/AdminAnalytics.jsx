import React from 'react';
import Card from '../Common/Card';
import './Admin.css';

const AdminAnalytics = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>View insights and statistics about placements</p>
      </div>

      <Card>
        <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Analytics dashboard will be implemented in the next phase.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
