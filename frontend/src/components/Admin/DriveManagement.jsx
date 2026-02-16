
import React, { useState } from 'react';
import {
  Search as SearchIcon, LocationOn as LocationIcon,
  CalendarToday as CalendarIcon, Work as WorkIcon, ArrowBack as ArrowBackIcon,
  People as PeopleIcon, Business as BusinessIcon
} from '@mui/icons-material';

const DriveManagement = () => {
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Mock Data matching the user's image requirements
  const drives = [
    {
      id: 1,
      company: 'Google',
      role: 'SDE Intern',
      location: 'Bangalore',
      type: 'On-Campus',
      date: '2026-02-15',
      salary: '₹45 LPA',
      eligibility: 'CSE, IT (8+ CGPA)',
      status: 'upcoming',
      logoBg: 'bg-blue-100 text-blue-600',
      description: "Google is hiring SDE Interns for their Bangalore office. The drive includes an online test, 2 technical interviews, and an HR round.",
      registered: 145,
      rounds: [
        { id: 1, name: 'Online Assessment', type: 'Coding', duration: '90 min', questions: '3 question(s)' },
        { id: 2, name: 'Technical Interview 1', type: 'DSA + Problem Solving', duration: '60 min', questions: '2 question(s)' },
        { id: 3, name: 'Technical Interview 2', type: 'System Design Basics', duration: '45 min', questions: '1 question(s)' },
        { id: 4, name: 'HR Round', type: 'Behavioral', duration: '30 min', questions: '5 question(s)' },
      ]
    },
    {
      id: 2,
      company: 'Amazon',
      role: 'SDE-1',
      location: 'Hyderabad',
      type: 'Virtual',
      date: '2026-02-20',
      salary: '₹38 LPA',
      eligibility: 'All branches (7+ CGPA)',
      status: 'upcoming',
      logoBg: 'bg-orange-100 text-orange-600',
      description: "Amazon is looking for SDE-1 candidates. The process will be virtual.",
      registered: 210,
      rounds: [
        { id: 1, name: 'Online Assessment', type: 'Coding & Aptitude', duration: '90 min', questions: '4 question(s)' },
        { id: 2, name: 'Technical Interview', type: 'DSA', duration: '60 min', questions: '2 question(s)' },
        { id: 3, name: 'Bar Raiser', type: 'System Design & Leadership', duration: '60 min', questions: '2 question(s)' },
      ]
    },
    {
      id: 3,
      company: 'Deloitte',
      role: 'Analyst',
      location: 'Mumbai',
      type: 'On-Campus',
      date: '2026-02-25',
      salary: '₹12 LPA',
      eligibility: 'MBA, BBA',
      status: 'upcoming',
      logoBg: 'bg-green-100 text-green-600',
      description: "Deloitte requires specific domain knowledge for the Analyst role.",
      registered: 85,
      rounds: [
        { id: 1, name: 'Aptitude Test', type: 'General Aptitude', duration: '60 min', questions: '30 question(s)' },
        { id: 2, name: 'Group Discussion', type: 'Communication', duration: '30 min', questions: '1 topic' },
        { id: 3, name: 'Personal Interview', type: 'Technical + HR', duration: '45 min', questions: 'Varies' },
      ]
    },
    {
      id: 4,
      company: 'Microsoft',
      role: 'SDE',
      location: 'Bangalore',
      type: 'On-Campus',
      date: '2026-01-10',
      salary: '₹42 LPA',
      eligibility: 'CSE, IT, ECE',
      status: 'completed',
      logoBg: 'bg-blue-100 text-blue-600',
      description: "Microsoft's campus drive for SDE roles.",
      registered: 300,
      rounds: []
    },
    {
      id: 5,
      company: 'TCS',
      role: 'System Engineer',
      location: 'Mumbai',
      type: 'Virtual',
      date: '2026-01-05',
      salary: '₹7 LPA',
      eligibility: 'All branches',
      status: 'completed',
      logoBg: 'bg-indigo-100 text-indigo-600',
      description: "TCS Ninja and Digital hiring profiles.",
      registered: 500,
      rounds: []
    }
  ];

  const handleDriveClick = (drive) => {
    setSelectedDrive(drive);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedDrive(null);
    setView('list');
  };

  const filteredDrives = drives.filter(drive =>
    (filterStatus === 'All Status' || drive.status === filterStatus.toLowerCase()) &&
    (drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const StatusBadge = ({ status }) => {
    const styles = status === 'upcoming'
      ? 'bg-orange-100 text-orange-600 border-orange-200'
      : 'bg-green-100 text-green-600 border-green-200';
    return (
      <span className={`px - 3 py - 1 rounded - full text - xs font - medium border ${styles} capitalize`}>
        {status}
      </span>
    );
  };

  if (view === 'detail' && selectedDrive) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowBackIcon fontSize="small" className="group-hover:-translate-x-1 transition-transform" />
          Back to Drives
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`w - 16 h - 16 rounded - xl flex items - center justify - center text - 2xl font - bold ${selectedDrive.logoBg} `}>
              {selectedDrive.company[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedDrive.company} — <span className="text-gray-600 font-medium">{selectedDrive.role}</span>
                </h1>
                <StatusBadge status={selectedDrive.status} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon fontSize="small" className="text-gray-400" />
                  {selectedDrive.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <LocationIcon fontSize="small" className="text-gray-400" />
                  {selectedDrive.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <WorkIcon fontSize="small" className="text-gray-400" />
                  {selectedDrive.salary}
                </div>
                <div className="flex items-center gap-1.5">
                  <PeopleIcon fontSize="small" className="text-gray-400" />
                  {selectedDrive.registered} registered
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {selectedDrive.description}
                </p>
                <div>
                  <span className="font-semibold text-gray-900">Eligibility: </span>
                  <span className="text-gray-600">{selectedDrive.eligibility}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Interview Rounds</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {selectedDrive.rounds && selectedDrive.rounds.length > 0 ? (
              selectedDrive.rounds.map((round, index) => (
                <div key={round.id} className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-semibold text-gray-900">{round.name}</h4>
                      <div className="text-right">
                        <span className="block text-sm text-gray-500 font-medium">{round.duration}</span>
                        <span className="block text-xs text-gray-400">{round.questions}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{round.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No detailed round information available for this drive.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
        <p className="text-gray-500 mt-1">Track upcoming and past placement drives</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center px-3 gap-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search drives..."
            className="flex-1 py-2 outline-none text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-2"></div>
        <select
          className="bg-transparent text-sm font-medium text-gray-600 outline-none px-4 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            onClick={() => handleDriveClick(drive)}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Logo */}
              <div className={`w - 12 h - 12 rounded - lg flex - shrink - 0 flex items - center justify - center text - lg font - bold ${drive.logoBg} `}>
                {drive.company[0]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {drive.company}
                  </h3>
                  <div className="hidden md:block">
                    <StatusBadge status={drive.status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 items-center">
                  <span className="flex items-center gap-1">
                    <BusinessIcon fontSize="inherit" className="text-gray-400" />
                    {drive.role}
                  </span>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon fontSize="inherit" className="text-gray-400" />
                    {drive.date}
                  </span>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <LocationIcon fontSize="inherit" className="text-gray-400" />
                    {drive.location}
                  </span>
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-1 md:gap-0">
                <div className="md:text-right">
                  <div className="text-lg font-bold text-gray-900">{drive.salary}</div>
                  <div className="text-xs text-gray-500">{drive.eligibility}</div>
                </div>
                <div className="md:hidden">
                  <StatusBadge status={drive.status} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDrives.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No drives found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveManagement;
