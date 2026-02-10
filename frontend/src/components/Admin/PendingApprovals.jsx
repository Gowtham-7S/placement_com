import React from 'react';
import Card from '../Common/Card';
import './Admin.css';

const PendingApprovals = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Pending Approvals</h1>
        <p>Review and approve/reject experience submissions</p>
      </div>

      <Card>
        <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Approval queue interface will be implemented in the next phase.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PendingApprovals;
