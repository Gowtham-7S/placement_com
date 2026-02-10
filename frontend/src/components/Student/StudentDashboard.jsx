import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import { experienceAPI } from '../../api';
import './Student.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await experienceAPI.getMyExperiences({ limit: 100 });
      const experiences = response.data.data || [];
      
      setStats({
        total: experiences.length,
        pending: experiences.filter((e) => e.approval_status === 'pending').length,
        approved: experiences.filter((e) => e.approval_status === 'accepted').length,
        rejected: experiences.filter((e) => e.approval_status === 'rejected').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Track your interview experiences and submissions</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.pending}
          </div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.approved}
          </div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#dc2626' }}>
            {stats.rejected}
          </div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="dashboard-actions">
          <Button
            label="+ Submit New Experience"
            onClick={() => navigate('/student/submit-experience')}
            variant="primary"
          />
          <Button
            label="View My Submissions"
            onClick={() => navigate('/student/experiences')}
            variant="secondary"
          />
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Next Steps</h2>
        <Card>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📝</span>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Submit Interview Experience</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Share your interview details including rounds, questions, and feedback
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⏳</span>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Wait for Admin Review</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Admins will review and approve your submission
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Contribute to Database</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Your approved experiences help other students prepare
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
