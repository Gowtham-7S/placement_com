import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../api';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Alert, CircularProgress, IconButton, Typography 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Language as WebIcon } from '@mui/icons-material';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    headquarters: '',
    industry: '',
    company_size: '',
    founded_year: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getAll({ limit: 100 });
      setCompanies(response.data.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load companies' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (company = null) => {
    if (company) {
      setFormData(company);
      setEditingId(company.id);
    } else {
      setFormData({
        name: '',
        description: '',
        website: '',
        headquarters: '',
        industry: '',
        company_size: '',
        founded_year: '',
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
        setAlert({ type: 'success', message: 'Company updated successfully' });
      } else {
        await companyAPI.create(formData);
        setAlert({ type: 'success', message: 'Company created successfully' });
      }
      setModalOpen(false);
      fetchCompanies();
    } catch (error) {
      setAlert({ type: 'error', message: 'Operation failed' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyAPI.delete(id);
        setAlert({ type: 'success', message: 'Company deleted successfully' });
        fetchCompanies();
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete company' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'founded_year' ? parseInt(value) : value,
    }));
  };

  if (loading) return <div className="flex justify-center p-8"><CircularProgress /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800">Company Management</Typography>
          <Typography variant="body1" className="text-gray-600">Add, edit, or manage placement companies</Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add Company
        </Button>
      </div>

      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Website</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.company_size}</TableCell>
                <TableCell>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <WebIcon fontSize="small" />
                    </a>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(company)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(company.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8 text-gray-500">
                  No companies found. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <TextField
              label="Company Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              label="Website"
              name="website"
              fullWidth
              value={formData.website}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
              label="Industry"
              name="industry"
              fullWidth
              value={formData.industry}
              onChange={handleChange}
            />
            <TextField
              label="Company Size"
              name="company_size"
              fullWidth
              value={formData.company_size}
              onChange={handleChange}
            />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField
              label="Headquarters"
              name="headquarters"
              fullWidth
              value={formData.headquarters}
              onChange={handleChange}
            />
            <TextField
              label="Founded Year"
              name="founded_year"
              type="number"
              fullWidth
              value={formData.founded_year}
              onChange={handleChange}
            />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
