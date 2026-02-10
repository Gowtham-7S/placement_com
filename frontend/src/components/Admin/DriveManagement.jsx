import React from 'react';
import Card from '../Common/Card';
import './Admin.css';

const DriveManagement = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Drive Management</h1>
        <p>Coming soon: Manage placement drives</p>
      </div>

      <Card>
        <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Drive management interface will be implemented in the next phase.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DriveManagement;
