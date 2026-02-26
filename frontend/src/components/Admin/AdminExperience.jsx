import React, { useState, useEffect } from 'react';
import { adminExperienceAPI } from '../../api';
import './AdminExperience.css';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    company_name: '',
    result: '',
  });

  // Modal state
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch experiences
  const fetchExperiences = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNum,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty filter values
      Object.keys(params).forEach(
        key => params[key] === '' && delete params[key]
      );

      const response = await adminExperienceAPI.getAll(params);

      if (response.data.success) {
        setExperiences(response.data.data || []);
        setPagination({
          page: response.data.page || pageNum,
          limit: response.data.limit || pagination.limit,
          total: response.data.total || 0,
          pages: response.data.pages || Math.ceil((response.data.total || 0) / pagination.limit),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch experiences');
      console.error('Fetch experiences error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full experience details
  const fetchExperienceDetails = async (id) => {
    setDetailLoading(true);
    try {
      const response = await adminExperienceAPI.getById(id);
      if (response.data.success) {
        setSelectedExperience(response.data.data);
        setShowModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch experience details');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchExperiences(newPage);
    }
  };

  // Initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchExperiences(1);
  }, [filters]);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'accepted': 'status-accepted',
      'pending': 'status-pending',
      'rejected': 'status-rejected',
    };
    return statusMap[status] || 'status-default';
  };

  const getResultBadgeClass = (result) => {
    const resultMap = {
      'selected': 'result-selected',
      'rejected': 'result-rejected',
      'hold': 'result-hold',
    };
    return resultMap[result] || 'result-default';
  };

  return (
    <div className="admin-experience-container">
      {/* Header */}
      <div className="experience-header">
        <h2>Student Experiences</h2>
        <p>View and manage all student interview experiences</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Approval Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">All Statuses</option>
            <option value="accepted">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={filters.company_name}
            onChange={handleFilterChange}
            placeholder="Search company..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Result</label>
          <select
            name="result"
            value={filters.result}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">All Results</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="empty-state">
          <p>📭 No experiences found matching your filters</p>
        </div>
      ) : (
        <>
          {/* Experiences Table */}
          <div className="experiences-table-wrapper">
            <table className="experiences-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Student</th>
                  <th>Result</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <span className="company-name">{exp.company_name}</span>
                    </td>
                    <td>{exp.role_applied}</td>
                    <td>
                      <span className="anonymous-badge">
                        {exp.is_anonymous ? '🔐 Anonymous' : `User #${exp.user_id}`}
                      </span>
                    </td>
                    <td>
                      <span className={`result-badge ${getResultBadgeClass(exp.result)}`}>
                        {exp.result || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(exp.approval_status)}`}>
                        {exp.approval_status}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(exp.submitted_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => fetchExperienceDetails(exp.id)}
                        className="view-btn"
                        title="View full details"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <div className="pagination-info">
              Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showModal && selectedExperience && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Loading details...</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="modal-header">
                  <h3>{selectedExperience.company_name} - {selectedExperience.role_applied}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="modal-close-btn"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Basic Details */}
                  <section className="detail-section">
                    <h4>Basic Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Company</label>
                        <p>{selectedExperience.company_name}</p>
                      </div>
                      <div className="detail-item">
                        <label>Position</label>
                        <p>{selectedExperience.role_applied}</p>
                      </div>
                      <div className="detail-item">
                        <label>Result</label>
                        <p>
                          <span className={`result-badge ${getResultBadgeClass(selectedExperience.result)}`}>
                            {selectedExperience.result || 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="detail-item">
                        <label>Status</label>
                        <p>
                          <span className={`status-badge ${getStatusBadgeClass(selectedExperience.approval_status)}`}>
                            {selectedExperience.approval_status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Interview Details */}
                  <section className="detail-section">
                    <h4>Interview Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Interview Duration</label>
                        <p>{selectedExperience.interview_duration ? `${selectedExperience.interview_duration} minutes` : 'N/A'}</p>
                      </div>
                      <div className="detail-item">
                        <label>Overall Difficulty</label>
                        <p className="difficulty-badge">
                          {selectedExperience.overall_difficulty || 'N/A'}
                        </p>
                      </div>
                      <div className="detail-item">
                        <label>Offer Received</label>
                        <p>{selectedExperience.offer_received ? '✓ Yes' : '✗ No'}</p>
                      </div>
                      {selectedExperience.ctc_offered && (
                        <div className="detail-item">
                          <label>CTC Offered</label>
                          <p>₹ {selectedExperience.ctc_offered.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Feedback */}
                  {selectedExperience.overall_feedback && (
                    <section className="detail-section">
                      <h4>Feedback</h4>
                      <div className="feedback-box">
                        <p>{selectedExperience.overall_feedback}</p>
                      </div>
                    </section>
                  )}

                  {/* Rounds */}
                  {selectedExperience.rounds && selectedExperience.rounds.length > 0 && (
                    <section className="detail-section">
                      <h4>Interview Rounds ({selectedExperience.rounds.length})</h4>
                      <div className="rounds-container">
                        {selectedExperience.rounds.map((round, idx) => (
                          <div key={idx} className="round-card">
                            <div className="round-header">
                              <h5>Round {round.round_number || idx + 1} - {round.round_type}</h5>
                              <span className="round-result">{round.result || 'N/A'}</span>
                            </div>
                            <div className="round-details">
                              {round.duration_minutes && (
                                <p><strong>Duration:</strong> {round.duration_minutes} minutes</p>
                              )}
                              {round.difficulty_level && (
                                <p><strong>Difficulty:</strong> {round.difficulty_level}</p>
                              )}
                              {round.topics && round.topics.length > 0 && (
                                <p><strong>Topics:</strong> {round.topics.join(', ')}</p>
                              )}
                              {round.problem_statement && (
                                <div className="problem-statement">
                                  <strong>Problem Statement:</strong>
                                  <p>{round.problem_statement}</p>
                                </div>
                              )}
                              {round.approach_used && (
                                <div className="approach-used">
                                  <strong>Approach Used:</strong>
                                  <p>{round.approach_used}</p>
                                </div>
                              )}
                              {round.tips_and_insights && (
                                <div className="tips-box">
                                  <strong>💡 Tips & Insights:</strong>
                                  <p>{round.tips_and_insights}</p>
                                </div>
                              )}
                            </div>

                            {/* Questions in Round */}
                            {round.questions && round.questions.length > 0 && (
                              <div className="questions-list">
                                <strong>Questions Asked:</strong>
                                <ul>
                                  {round.questions.map((q, qIdx) => (
                                    <li key={qIdx}>
                                      <span className="question-text">{q.question_text}</span>
                                      <span className="question-meta">
                                        [{q.category} • {q.difficulty}]
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Additional Info */}
                  <section className="detail-section">
                    <h4>Submission Info</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Submitted</label>
                        <p>{new Date(selectedExperience.submitted_at).toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Anonymous</label>
                        <p>{selectedExperience.is_anonymous ? '🔐 Yes' : 'No'}</p>
                      </div>
                      {selectedExperience.admin_comments && (
                        <div className="detail-item full-width">
                          <label>Admin Comments</label>
                          <p>{selectedExperience.admin_comments}</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button
                    onClick={() => setShowModal(false)}
                    className="close-modal-btn"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
