import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import { experienceAPI } from '../../api';
import './Student.css';

const MyExperiences = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await experienceAPI.getMyExperiences({ limit: 100 });
      setExperiences(response.data.data || []);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceAPI.delete(id);
        setExperiences(experiences.filter((e) => e.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) return <Loading message="Loading your experiences..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Experiences</h1>
        <p>View and manage your submitted interview experiences</p>
      </div>

      <div className="dashboard-actions">
        <Button
          label="+ Submit New Experience"
          onClick={() => navigate('/student/submit-experience')}
          variant="primary"
        />
      </div>

      {experiences.length === 0 ? (
        <Card>
          <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              You haven't submitted any experiences yet.
            </p>
            <Button
              label="Submit Your First Experience"
              onClick={() => navigate('/student/submit-experience')}
              variant="primary"
            />
          </Card.Body>
        </Card>
      ) : (
        <div className="experience-list">
          {experiences.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="experience-info">
                <div className="experience-company">{exp.company_name}</div>
                <div className="experience-role">{exp.role_applied}</div>
                <div className="experience-meta">
                  Submitted: {new Date(exp.submitted_at).toLocaleDateString()}
                </div>
              </div>

              <div className="experience-result">
                <span className={`submission-badge badge-${exp.approval_status}`}>
                  {exp.approval_status}
                </span>
                <span className={`result-badge result-${exp.result}`}>
                  {exp.result === 'not_sure' ? 'Not Sure' : exp.result.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <Button
                  label="View"
                  onClick={() => navigate(`/student/experience/${exp.id}`)}
                  variant="secondary"
                  size="small"
                />
                <Button
                  label="Delete"
                  onClick={() => handleDelete(exp.id)}
                  variant="danger"
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExperiences;
