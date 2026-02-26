import React, { useState, useEffect } from 'react';
import {
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { approvalAPI, adminExperienceAPI } from '../../api';
import './PendingApprovals.css';

const PendingApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  
  // Action states
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalAPI.getPending({ limit: 50 });
      setApprovals(response.data.data || []);
    } catch (err) {
      console.error('Failed to load pending approvals:', err);
      setError('Failed to load pending approvals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperienceDetails = async (id) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await adminExperienceAPI.getById(id);
      if (response.data.success) {
        setSelectedApproval(response.data.data);
        setRejectionReason('');
      }
    } catch (err) {
      console.error('Failed to fetch experience details:', err);
      setDetailError('Failed to load experience details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;
    setActionLoading('approve');
    try {
      await approvalAPI.approve(selectedApproval.id, { comment: '' });
      setApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
      setSelectedApproval(null);
    } catch (err) {
      console.error('Failed to approve submission:', err);
      setDetailError('Failed to approve. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectionReason.trim()) {
      setDetailError('Please provide a rejection reason');
      return;
    }
    setActionLoading('reject');
    try {
      await approvalAPI.reject(selectedApproval.id, { reason: rejectionReason });
      setApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
      setSelectedApproval(null);
    } catch (err) {
      console.error('Failed to reject submission:', err);
      setDetailError('Failed to reject. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };


  const getResultBadgeClass = (result) => {
    const resultMap = {
      'selected': 'result-selected',
      'rejected': 'result-rejected',
      'hold': 'result-hold',
    };
    return resultMap[result] || 'result-default';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchPendingApprovals}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshIcon fontSize="small" />
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-500 mt-1">{approvals.length} experience(s) awaiting review</p>
        </div>
        <button
          onClick={fetchPendingApprovals}
          className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* Approval List */}
      <div className="space-y-3">
        {approvals.map((item) => (
          <div
            key={item.id}
            onClick={() => fetchExperienceDetails(item.id)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {item.company_name}
                  <span className="text-gray-400 font-light">—</span>
                  {item.role_applied}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.first_name && item.last_name
                    ? <>by <span className="font-medium text-gray-700">{item.first_name} {item.last_name}</span> • </>
                    : null
                  }
                  Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium border border-orange-200 flex-shrink-0">
                Pending
              </span>
            </div>
            <p className="text-sm text-indigo-600 mt-3 flex items-center gap-1">
              👁️ Click to view details
            </p>
          </div>
        ))}

        {approvals.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <AccessTimeIcon fontSize="large" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No pending approvals</h3>
            <p className="text-gray-500 mt-1">All caught up! New submissions will appear here.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApproval && (
        <div className="modal-overlay" onClick={() => setSelectedApproval(null)}>
          <div className="modal-content-approval" onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Loading details...</p>
              </div>
            ) : detailError ? (
              <div className="detail-error">
                <p>{detailError}</p>
                <button onClick={() => setSelectedApproval(null)} className="close-modal-btn">Close</button>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="modal-header-approval">
                  <h3>{selectedApproval.company_name} - {selectedApproval.role_applied}</h3>
                  <button onClick={() => setSelectedApproval(null)} className="modal-close-btn">✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-approval">
                  {/* Basic Details */}
                  <section className="detail-section">
                    <h4>Basic Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Company</label>
                        <p>{selectedApproval.company_name}</p>
                      </div>
                      <div className="detail-item">
                        <label>Position</label>
                        <p>{selectedApproval.role_applied}</p>
                      </div>
                      <div className="detail-item">
                        <label>Result</label>
                        <p>
                          <span className={`result-badge ${getResultBadgeClass(selectedApproval.result)}`}>
                            {selectedApproval.result || 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="detail-item">
                        <label>Offer Received</label>
                        <p>{selectedApproval.offer_received ? '✓ Yes' : '✗ No'}</p>
                      </div>
                    </div>
                  </section>

                  {/* Interview Details */}
                  <section className="detail-section">
                    <h4>Interview Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Overall Difficulty</label>
                        <p className="difficulty-badge">{selectedApproval.overall_difficulty || 'N/A'}</p>
                      </div>
                      {selectedApproval.ctc_offered && (
                        <div className="detail-item">
                          <label>CTC Offered</label>
                          <p>₹ {selectedApproval.ctc_offered.toLocaleString()}</p>
                        </div>
                      )}
                      <div className="detail-item">
                        <label>Anonymous</label>
                        <p>{selectedApproval.is_anonymous ? '🔐 Yes' : 'No'}</p>
                      </div>
                    </div>
                  </section>

                  {/* Feedback */}
                  {selectedApproval.overall_feedback && (
                    <section className="detail-section">
                      <h4>Student Feedback</h4>
                      <div className="feedback-box-approval">
                        <p>{selectedApproval.overall_feedback}</p>
                      </div>
                    </section>
                  )}

                  {/* Rounds */}
                  {selectedApproval.rounds && selectedApproval.rounds.length > 0 && (
                    <section className="detail-section">
                      <h4>Interview Rounds ({selectedApproval.rounds.length})</h4>
                      <div className="rounds-container">
                        {selectedApproval.rounds.map((round, idx) => (
                          <div key={idx} className="round-card">
                            <div className="round-header">
                              <h5>Round {round.round_number || idx + 1} - {round.round_type}</h5>
                              <span className="round-result">{round.result || 'N/A'}</span>
                            </div>
                            <div className="round-details">
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
                              {round.tips_and_insights && (
                                <div className="tips-box">
                                  <strong>💡 Tips & Insights:</strong>
                                  <p>{round.tips_and_insights}</p>
                                </div>
                              )}
                            </div>
                            {round.questions && round.questions.length > 0 && (
                              <div className="questions-list">
                                <strong>Questions Asked:</strong>
                                <ul>
                                  {round.questions.map((q, qIdx) => (
                                    <li key={qIdx}>
                                      <span className="question-text">{q.question_text}</span>
                                      <span className="question-meta">[{q.category} • {q.difficulty}]</span>
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
                </div>

                {/* Modal Footer - Action Buttons */}
                <div className="modal-footer-approval">
                  <div className="rejection-section">
                    <label>Rejection Reason (required if rejecting)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide feedback for rejection..."
                      className="rejection-textarea"
                      disabled={!!actionLoading}
                      rows="3"
                    />
                  </div>

                  {detailError && <div className="action-error">{detailError}</div>}

                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedApproval(null)}
                      className="action-btn-cancel"
                      disabled={!!actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="action-btn-reject"
                      disabled={!!actionLoading || !rejectionReason.trim()}
                    >
                      {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      onClick={handleApprove}
                      className="action-btn-approve"
                      disabled={!!actionLoading}
                    >
                      {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
