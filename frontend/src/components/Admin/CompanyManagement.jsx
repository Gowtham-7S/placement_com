import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  MenuItem, IconButton, Menu
} from '@mui/material';
import { MoreVert as MoreVertIcon, Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon, LocationOn as LocationIcon, Business as BusinessIcon } from '@mui/icons-material';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', website: '', headquarters: '', industry: '', company_size: '', founded_year: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getAll({ limit: 100 });
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (company = null) => {
    handleMenuClose();
    if (company) {
      setFormData(company);
      setEditingId(company.id);
    } else {
      setFormData({
        name: '', description: '', website: '', headquarters: '', industry: '', company_size: '', founded_year: '',
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await companyAPI.update(editingId, formData);
      } else {
        await companyAPI.create(formData);
      }
      setModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Operation failed');
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyAPI.delete(selectedCompanyId);
        fetchCompanies();
      } catch (error) {
        console.error('Failed to delete company');
      }
    }
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompanyId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompanyId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'founded_year' ? parseInt(value) : value,
    }));
  };

  // Mock data generators for UI demo
  const getMockPackage = (id) => {
    const packages = ['₹45 LPA', '₹42 LPA', '₹38 LPA', '₹28 LPA', '₹12 LPA', '₹7 LPA'];
    return packages[id % packages.length] || '₹10 LPA';
  };

  const getMockDrives = (id) => {
    return (id % 8) + 2;
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitialColor = (letter) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-indigo-100 text-indigo-600', 'bg-pink-100 text-pink-600', 'bg-orange-100 text-orange-600'];
    return colors[letter.charCodeAt(0) % colors.length];
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Browse companies that recruit from your campus</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
        >
          <AddIcon fontSize="small" />
          Add Company
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center px-3 gap-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            className="flex-1 py-2 outline-none text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-2"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium">All Industries</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="p-6">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${getInitialColor(company.name[0])}`}>
                  {company.name[0].toUpperCase()}
                </div>
                <button onClick={(e) => handleMenuClick(e, company.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                  <MoreVertIcon />
                </button>
              </div>

              {/* Company Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{company.industry}</p>
              </div>

              {/* Meta Details */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <LocationIcon fontSize="inherit" className="text-gray-400" />
                  {company.headquarters || 'Remote'}
                </div>
                <div className="flex items-center gap-1">
                  <BusinessIcon fontSize="inherit" className="text-gray-400" />
                  {getMockDrives(company.id)} drives
                </div>
              </div>

              {/* Footer / Stats */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Avg Package</span>
                <span className="text-sm font-bold text-gray-900">{getMockPackage(company.id)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
          },
        }}
      >
        <MenuItem onClick={() => handleOpenModal(companies.find(c => c.id === selectedCompanyId))}>Edit Company</MenuItem>
        <MenuItem onClick={handleDelete} className="text-red-600">Delete</MenuItem>
      </Menu>

      {/* Edit/Add Modal - Keeping MUI for logic simplicity, styled simply */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold border-b border-gray-100">{editingId ? 'Edit Company' : 'Add New Company'}</DialogTitle>
        <DialogContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <TextField label="Company Name" name="name" fullWidth value={formData.name} onChange={handleChange} required variant="outlined" size="small" />
            <TextField label="Description" name="description" multiline rows={3} fullWidth value={formData.description} onChange={handleChange} variant="outlined" size="small" />
            <TextField label="Website" name="website" fullWidth value={formData.website} onChange={handleChange} variant="outlined" size="small" />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Industry" name="industry" fullWidth value={formData.industry} onChange={handleChange} variant="outlined" size="small" />
              <TextField label="Company Size" name="company_size" fullWidth value={formData.company_size} onChange={handleChange} variant="outlined" size="small" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Headquarters" name="headquarters" fullWidth value={formData.headquarters} onChange={handleChange} variant="outlined" size="small" />
              <TextField label="Founded Year" name="founded_year" type="number" fullWidth value={formData.founded_year} onChange={handleChange} variant="outlined" size="small" />
            </div>
          </form>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={() => setModalOpen(false)} className="text-gray-500">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" className="bg-indigo-600 hover:bg-indigo-700 shadow-none">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
