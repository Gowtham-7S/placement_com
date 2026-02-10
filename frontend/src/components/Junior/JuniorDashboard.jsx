import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import './Junior.css';

const JuniorDashboard = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: '🔍',
      title: 'Browse Companies',
      description: 'Explore participating companies',
      action: () => navigate('/junior/companies'),
    },
    {
      icon: '📢',
      title: 'View Drives',
      description: 'Check upcoming placement drives',
      action: () => navigate('/junior/roadmap'),
    },
    {
      icon: '🎯',
      title: 'Preparation Roadmap',
      description: 'Get tailored preparation guide',
      action: () => navigate('/junior/roadmap'),
    },
    {
      icon: '📊',
      title: 'Topic Insights',
      description: 'Most asked interview topics',
      action: () => navigate('/junior/roadmap'),
    },
  ];

  return (
    <div className="junior-dashboard">
      <div className="dashboard-header">
        <h1>Junior Dashboard</h1>
        <p>Explore placement opportunities and prepare effectively</p>
      </div>

      <div className="items-grid">
        {quickLinks.map((link, index) => (
          <Card key={index}>
            <Card.Body
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onClick={link.action}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{link.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {link.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {link.description}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Card>
        <Card.Header>How It Works</Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>1️⃣</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Explore Companies</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Browse companies that participated in placements
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>2️⃣</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Learn from Experiences</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Read real interview experiences shared by students
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>3️⃣</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Get Insights</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  View most asked topics and preparation tips
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>4️⃣</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Prepare & Apply</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Use insights to prepare and apply for drives
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default JuniorDashboard;
