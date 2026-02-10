import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../Common/Card';
import Loading from '../Common/Loading';
import { experienceAPI } from '../../api';
import './Student.css';

const ExperienceDetail = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await experienceAPI.getById(id);
      setExperience(response.data.data);
    } catch (error) {
      console.error('Failed to load experience:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading experience..." />;

  if (!experience) {
    return (
      <div className="dashboard">
        <Card>
          <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Experience not found</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{experience.company_name} - {experience.role_applied}</h1>
        <p>Experience submitted on {new Date(experience.submitted_at).toLocaleDateString()}</p>
      </div>

      {/* Basic Information */}
      <Card>
        <Card.Header>Basic Information</Card.Header>
        <Card.Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Company</div>
              <div style={{ fontWeight: '600' }}>{experience.company_name}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Role</div>
              <div style={{ fontWeight: '600' }}>{experience.role_applied}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Result</div>
              <span className={`result-badge result-${experience.result}`}>
                {experience.result.toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Status</div>
              <span className={`submission-badge badge-${experience.approval_status}`}>
                {experience.approval_status}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Interview Details */}
      <Card>
        <Card.Header>Interview Details</Card.Header>
        <Card.Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Overall Difficulty</div>
              <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{experience.overall_difficulty}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Confidence Level</div>
              <div style={{ fontWeight: '600' }}>{experience.confidence_level}/10</div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Overall Feedback</div>
            <p>{experience.overall_feedback || 'No feedback provided'}</p>
          </div>
          {experience.offer_received && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>CTC Offered</div>
              <div style={{ fontWeight: '600' }}>{experience.ctc_offered} LPA</div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Rounds */}
      <Card>
        <Card.Header>Interview Rounds</Card.Header>
        <Card.Body>
          {experience.rounds && experience.rounds.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experience.rounds.map((round, index) => (
                <div key={index} style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '12px' }}>
                    Round {round.round_number} - {round.round_type}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)' }}>Duration:</span> {round.duration_minutes} min
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)' }}>Result:</span>{' '}
                      <span style={{ textTransform: 'capitalize' }}>{round.result}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)' }}>Difficulty:</span>{' '}
                      <span style={{ textTransform: 'capitalize' }}>{round.difficulty_level}</span>
                    </div>
                  </div>
                  {round.tips_and_insights && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Tips</div>
                      <p>{round.tips_and_insights}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No rounds recorded</p>
          )}
        </Card.Body>
      </Card>

      {/* Admin Comments */}
      {experience.approval_status === 'rejected' && experience.rejection_reason && (
        <Card>
          <Card.Header>Rejection Reason</Card.Header>
          <Card.Body>
            <p>{experience.rejection_reason}</p>
            {experience.admin_comments && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Admin Comments</div>
                <p>{experience.admin_comments}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ExperienceDetail;
