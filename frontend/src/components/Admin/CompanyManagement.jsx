import React, { useState, useEffect } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Modal from '../Common/Modal';
import Alert from '../Common/Alert';
import Loading from '../Common/Loading';
import { companyAPI } from '../../api';
import './Admin.css';

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

  if (loading) return <Loading message="Loading companies..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Company Management</h1>
        <p>Add, edit, or manage placement companies</p>
      </div>

      <div className="dashboard-actions">
        <Button
          label="+ Add Company"
          onClick={() => handleOpenModal()}
          variant="primary"
        />
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="items-grid">
        {companies.map((company) => (
          <Card key={company.id}>
            <Card.Body>
              <div className="item-card-title">{company.name}</div>
              <div className="item-card-desc" style={{ marginBottom: '12px' }}>
                {company.industry} • {company.company_size}
              </div>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>
                  Website →
                </a>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Button
                  label="Edit"
                  onClick={() => handleOpenModal(company)}
                  variant="secondary"
                  size="small"
                />
                <Button
                  label="Delete"
                  onClick={() => handleDelete(company.id)}
                  variant="danger"
                  size="small"
                />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Company' : 'Add Company'}>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Input
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Google India"
              required
            />
            <Input
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Company description..."
            />
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Technology, Finance, etc."
            />
            <Input
              label="Company Size"
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              placeholder="e.g., 10000+"
            />
            <Input
              label="Headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              placeholder="City, Country"
            />
            <Input
              label="Founded Year"
              name="founded_year"
              type="number"
              value={formData.founded_year}
              onChange={handleChange}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button label="Cancel" onClick={() => setModalOpen(false)} variant="outline" />
          <Button label="Submit" onClick={handleSubmit} variant="primary" />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
