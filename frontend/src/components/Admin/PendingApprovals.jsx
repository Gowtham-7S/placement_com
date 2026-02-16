import React, { useState } from 'react';
import {
  Check as CheckIcon, Close as CloseIcon, AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const PendingApprovals = () => {
  // Mock data matching the user's image
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      company: 'Microsoft',
      role: 'SDE-1',
      candidate: 'Anita Patel',
      date: '2026-02-04',
      rounds: '3 rounds',
      difficulty: 'Medium',
      status: 'pending'
    },
    {
      id: 2,
      company: 'Adobe',
      role: 'MTS',
      candidate: 'Deepak Verma',
      date: '2026-02-06',
      rounds: '4 rounds',
      difficulty: 'Hard',
      status: 'pending'
    },
    {
      id: 3,
      company: 'Salesforce',
      role: 'SDE Intern',
      candidate: 'Kavya Nair',
      date: '2026-02-07',
      rounds: '3 rounds',
      difficulty: 'Medium',
      status: 'pending'
    }
  ]);

  const handleApprove = (id) => {
    // In a real app, this would call the API
    setApprovals(approvals.filter(a => a.id !== id));
    // console.log(`Approved experience ${id}`);
  };

  const handleReject = (id) => {
    // In a real app, this would call the API
    setApprovals(approvals.filter(a => a.id !== id));
    // console.log(`Rejected experience ${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500 mt-1">{approvals.length} experience(s) awaiting review</p>
      </div>

      {/* Approval List */}
      <div className="space-y-6">
        {approvals.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {item.company} <span className="text-gray-400 font-light">—</span> {item.role}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  by <span className="font-medium text-gray-700">{item.candidate}</span> • {item.date} • {item.rounds} • {item.difficulty}
                </p>
              </div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium border border-orange-200">
                Pending
              </span>
            </div>

            {/* Actions Row */}
            <div className="flex gap-4 items-center mt-6">
              <input
                type="text"
                placeholder="Add a comment (optional)..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <CheckIcon fontSize="small" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <CloseIcon fontSize="small" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {approvals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-50 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <AccessTimeIcon fontSize="large" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No pending approvals</h3>
            <p className="text-gray-500 mt-1">All caught up! New submissions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
