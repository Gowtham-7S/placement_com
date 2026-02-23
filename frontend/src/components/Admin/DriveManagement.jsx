import React, { useState, useEffect } from 'react';
import {
  Search as SearchIcon, LocationOn as LocationIcon,
  CalendarToday as CalendarIcon, ArrowBack as ArrowBackIcon,
  People as PeopleIcon, Business as BusinessIcon, Add as AddIcon,
  AttachMoney as MoneyIcon, Close as CloseIcon,
  Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText,
  Typography,
} from '@mui/material';
import { driveAPI, companyAPI } from '../../api';

const DriveManagement = () => {
  const [view, setView] = useState('list');
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Add Drive modal state
  const [addOpen, setAddOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const emptyForm = {
    company_id: '', role_name: '', ctc: '', interview_date: '',
    registration_deadline: '', total_positions: '', mode: 'online',
    location: '', requirements: '', drive_status: 'upcoming',
  };
  const [driveForm, setDriveForm] = useState(emptyForm);

  // Edit Drive modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editDrive, setEditDrive] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteDrive, setDeleteDrive] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await driveAPI.getAll({ limit: 100 });
      setDrives(response.data.data || []);
    } catch (err) {
      console.error('Failed to load drives:', err);
      setError('Failed to load drives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await companyAPI.getAll({ limit: 200 });
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  const handleDriveFormChange = (e) => {
    const { name, value } = e.target;
    setDriveForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDrive = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      // Strip empty strings and convert numeric fields
      const payload = Object.fromEntries(
        Object.entries(driveForm).filter(([_, v]) => v !== '' && v !== null)
      );
      if (payload.ctc) payload.ctc = parseFloat(payload.ctc);
      if (payload.total_positions) payload.total_positions = parseInt(payload.total_positions);
      if (payload.company_id) payload.company_id = parseInt(payload.company_id);
      await driveAPI.create(payload);
      setAddOpen(false);
      setDriveForm(emptyForm);
      fetchDrives();
    } catch (err) {
      const msg = err.response?.data?.errors?.map(e => e.message).join(', ')
        || err.response?.data?.message
        || 'Failed to create drive';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDriveClick = async (drive) => {
    try {
      const response = await driveAPI.getById(drive.id);
      setSelectedDrive(response.data.data || drive);
    } catch (err) {
      console.error('Failed to load drive details:', err);
      setSelectedDrive(drive);
    }
    setView('detail');
  };

  const handleEditOpen = (e, drive) => {
    e.stopPropagation();
    setEditDrive(drive);
    setEditForm({
      company_id: drive.company_id || '',
      role_name: drive.role_name || '',
      ctc: drive.ctc || '',
      interview_date: drive.interview_date ? drive.interview_date.split('T')[0] : '',
      registration_deadline: drive.registration_deadline ? drive.registration_deadline.split('T')[0] : '',
      total_positions: drive.total_positions || '',
      mode: drive.mode || 'online',
      location: drive.location || '',
      requirements: drive.requirements || '',
      drive_status: drive.drive_status || 'upcoming',
    });
    setEditError('');
    setEditOpen(true);
  };

  const handleEditDrive = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(editForm).filter(([_, v]) => v !== '' && v !== null)
      );
      if (payload.ctc) payload.ctc = parseFloat(payload.ctc);
      if (payload.total_positions) payload.total_positions = parseInt(payload.total_positions);
      if (payload.company_id) payload.company_id = parseInt(payload.company_id);
      await driveAPI.update(editDrive.id, payload);
      setEditOpen(false);
      fetchDrives();
    } catch (err) {
      const msg = err.response?.data?.errors?.map(e => e.message).join(', ')
        || err.response?.data?.message || 'Failed to update drive';
      setEditError(msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteOpen = (e, drive) => {
    e.stopPropagation();
    setDeleteDrive(drive);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDrive) return;
    setDeleting(true);
    try {
      await driveAPI.delete(deleteDrive.id);
      setDeleteOpen(false);
      setDeleteDrive(null);
      fetchDrives();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete drive');
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    setSelectedDrive(null);
    setView('list');
  };

  // Helper to format CTC range
  const formatCTC = (drive) => {
    if (drive.ctc) return `₹${drive.ctc} LPA`;
    return 'Not disclosed';
  };

  // Helper to get a logo background color from company name
  const getLogoBg = (name = '') => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600',
    ];
    return colors[(name.charCodeAt(0) || 0) % colors.length];
  };

  // Normalize DB status to readable label
  const getStatusLabel = (status) => {
    const map = {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status] || status;
  };

  const filteredDrives = drives.filter(drive => {
    const statusMatch = filterStatus === 'All Status' || drive.drive_status === filterStatus.toLowerCase();
    const searchMatch =
      (drive.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drive.role_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const StatusBadge = ({ status }) => {
    const styleMap = {
      upcoming: 'bg-orange-100 text-orange-600 border-orange-200',
      ongoing: 'bg-blue-100 text-blue-600 border-blue-200',
      completed: 'bg-green-100 text-green-600 border-green-200',
      cancelled: 'bg-red-100 text-red-600 border-red-200',
    };
    const style = styleMap[status] || 'bg-gray-100 text-gray-600 border-gray-200';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style} capitalize`}>
        {getStatusLabel(status)}
      </span>
    );
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
          onClick={fetchDrives}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // ---- DETAIL VIEW ----
  if (view === 'detail' && selectedDrive) {
    return (
      <div className="max-w-5xl mx-auto">
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
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${getLogoBg(selectedDrive.company_name)}`}>
              {(selectedDrive.company_name || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedDrive.company_name} — <span className="text-gray-600 font-medium">{selectedDrive.role_name}</span>
                </h1>
                <StatusBadge status={selectedDrive.drive_status} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon fontSize="small" className="text-gray-400" />
                  {selectedDrive.interview_date ? new Date(selectedDrive.interview_date).toLocaleDateString() : 'TBD'}
                </div>
                {selectedDrive.location && (
                  <div className="flex items-center gap-1.5">
                    <LocationIcon fontSize="small" className="text-gray-400" />
                    {selectedDrive.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MoneyIcon fontSize="small" className="text-gray-400" />
                  {formatCTC(selectedDrive)}
                </div>
                {selectedDrive.total_positions && (
                  <div className="flex items-center gap-1.5">
                    <PeopleIcon fontSize="small" className="text-gray-400" />
                    {selectedDrive.filled_positions || 0}/{selectedDrive.total_positions} positions filled
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {selectedDrive.drive_details && (
                  <p className="text-gray-600 leading-relaxed">{selectedDrive.drive_details}</p>
                )}
                {selectedDrive.eligible_batches && (
                  <div>
                    <span className="font-semibold text-gray-900">Eligible Batches: </span>
                    <span className="text-gray-600">{selectedDrive.eligible_batches}</span>
                  </div>
                )}
                {selectedDrive.requirements && (
                  <div>
                    <span className="font-semibold text-gray-900">Requirements: </span>
                    <span className="text-gray-600">{selectedDrive.requirements}</span>
                  </div>
                )}
                {selectedDrive.mode && (
                  <div>
                    <span className="font-semibold text-gray-900">Mode: </span>
                    <span className="text-gray-600 capitalize">{selectedDrive.mode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Interview Rounds</h3>
          </div>
          <div className="p-8 text-center text-gray-500">
            {selectedDrive.round_count
              ? `This drive has ${selectedDrive.round_count} interview round(s). Detailed round data is available after candidates submit their experiences.`
              : 'No detailed round information available for this drive yet.'}
          </div>
        </div>
      </div>
    );
  }

  // ---- LIST VIEW ----
  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
          <p className="text-gray-500 mt-1">Manage and track placement drives</p>
        </div>
        <button
          onClick={() => { setDriveForm(emptyForm); setFormError(''); setAddOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
        >
          <AddIcon fontSize="small" />
          Add Drive
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center px-3 gap-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search drives by company or role..."
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
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            onClick={() => handleDriveClick(drive)}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
          >
            {/* Edit / Delete action buttons */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => handleEditOpen(e, drive)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Edit drive"
              >
                <EditIcon fontSize="small" />
              </button>
              <button
                onClick={(e) => handleDeleteOpen(e, drive)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete drive"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Logo */}
              <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-bold ${getLogoBg(drive.company_name)}`}>
                {(drive.company_name || '?')[0].toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {drive.company_name}
                  </h3>
                  <div className="hidden md:block">
                    <StatusBadge status={drive.drive_status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 items-center">
                  <span className="flex items-center gap-1">
                    <BusinessIcon fontSize="inherit" className="text-gray-400" />
                    {drive.role_name}
                  </span>
                  {drive.interview_date && (
                    <>
                      <span className="hidden md:inline text-gray-300">|</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon fontSize="inherit" className="text-gray-400" />
                        {new Date(drive.interview_date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  {drive.location && (
                    <>
                      <span className="hidden md:inline text-gray-300">|</span>
                      <span className="flex items-center gap-1">
                        <LocationIcon fontSize="inherit" className="text-gray-400" />
                        {drive.location}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-1">
                <div className="md:text-right">
                  <div className="text-lg font-bold text-gray-900">{formatCTC(drive)}</div>
                  {drive.total_positions && (
                    <div className="text-xs text-gray-500">{drive.total_positions} positions</div>
                  )}
                </div>
                <div className="md:hidden">
                  <StatusBadge status={drive.drive_status} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDrives.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No drives found</h3>
            <p className="text-gray-500">
              {drives.length === 0 ? 'No drives have been created yet.' : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Delete Drive
          <button onClick={() => setDeleteOpen(false)} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete the drive for
            <strong> {deleteDrive?.company_name}</strong> — <strong>{deleteDrive?.role_name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Drive Modal */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add New Drive
          <button onClick={() => setAddOpen(false)} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </DialogTitle>
        <form onSubmit={handleAddDrive}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <FormControl fullWidth required>
              <InputLabel>Company *</InputLabel>
              <Select
                name="company_id"
                value={driveForm.company_id}
                onChange={handleDriveFormChange}
                label="Company *"
              >
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the company conducting the drive</FormHelperText>
            </FormControl>

            <TextField
              label="Role / Job Title *"
              name="role_name"
              value={driveForm.role_name}
              onChange={handleDriveFormChange}
              required
              fullWidth
              placeholder="e.g. Software Engineer"
            />

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Interview Date *"
                name="interview_date"
                type="date"
                value={driveForm.interview_date}
                onChange={handleDriveFormChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Registration Deadline"
                name="registration_deadline"
                type="date"
                value={driveForm.registration_deadline}
                onChange={handleDriveFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="CTC (LPA)"
                name="ctc"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={driveForm.ctc}
                onChange={handleDriveFormChange}
                fullWidth
                placeholder="e.g. 12.5"
              />
              <TextField
                label="Total Positions"
                name="total_positions"
                type="number"
                inputProps={{ min: 1 }}
                value={driveForm.total_positions}
                onChange={handleDriveFormChange}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select
                  name="mode"
                  value={driveForm.mode}
                  onChange={handleDriveFormChange}
                  label="Mode"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="drive_status"
                  value={driveForm.drive_status}
                  onChange={handleDriveFormChange}
                  label="Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField
              label="Location"
              name="location"
              value={driveForm.location}
              onChange={handleDriveFormChange}
              fullWidth
              placeholder="e.g. Bengaluru / Remote"
            />

            <TextField
              label="Requirements / Eligibility"
              name="requirements"
              value={driveForm.requirements}
              onChange={handleDriveFormChange}
              fullWidth
              multiline
              rows={3}
              placeholder="e.g. 7.5 CGPA, No active backlogs, CSE/IT branches"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Drive'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Drive Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Drive — {editDrive?.company_name}
          <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </DialogTitle>
        <form onSubmit={handleEditDrive}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {editError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {editError}
              </div>
            )}

            <TextField
              label="Role / Job Title *"
              value={editForm.role_name}
              onChange={(e) => setEditForm(p => ({ ...p, role_name: e.target.value }))}
              required fullWidth
            />

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Interview Date *"
                type="date"
                value={editForm.interview_date}
                onChange={(e) => setEditForm(p => ({ ...p, interview_date: e.target.value }))}
                required fullWidth InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Registration Deadline"
                type="date"
                value={editForm.registration_deadline}
                onChange={(e) => setEditForm(p => ({ ...p, registration_deadline: e.target.value }))}
                fullWidth InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="CTC (LPA)"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={editForm.ctc}
                onChange={(e) => setEditForm(p => ({ ...p, ctc: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Total Positions"
                type="number"
                inputProps={{ min: 1 }}
                value={editForm.total_positions}
                onChange={(e) => setEditForm(p => ({ ...p, total_positions: e.target.value }))}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select
                  value={editForm.mode}
                  onChange={(e) => setEditForm(p => ({ ...p, mode: e.target.value }))}
                  label="Mode"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.drive_status}
                  onChange={(e) => setEditForm(p => ({ ...p, drive_status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField
              label="Location"
              value={editForm.location}
              onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Requirements / Eligibility"
              value={editForm.requirements}
              onChange={(e) => setEditForm(p => ({ ...p, requirements: e.target.value }))}
              fullWidth multiline rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={editSubmitting}>
              {editSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default DriveManagement;
