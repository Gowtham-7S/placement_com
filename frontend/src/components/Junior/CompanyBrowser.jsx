import React, { useState, useEffect } from 'react';
import Card from '../Common/Card';
import Loading from '../Common/Loading';
import Input from '../Common/Input';
import { companyAPI } from '../../api';
import './Junior.css';

const CompanyBrowser = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.searchPublic({ limit: 100 });
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !filterIndustry || company.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(companies.map((c) => c.industry).filter(Boolean))];

  if (loading) return <Loading message="Loading companies..." />;

  return (
    <div className="junior-dashboard">
      <div className="dashboard-header">
        <h1>Browse Companies</h1>
        <p>Explore companies participating in placements</p>
      </div>

      <div className="filter-section">
        <input
          type="text"
          className="filter-input"
          placeholder="Search by company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-input"
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
        >
          <option value="">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Showing {filteredCompanies.length} companies
      </div>

      {filteredCompanies.length === 0 ? (
        <Card>
          <Card.Body style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No companies found matching your criteria</p>
          </Card.Body>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCompanies.map((company) => (
            <div key={company.id} className="company-card">
              <div className="company-name">{company.name}</div>
              <div className="company-meta">
                {company.industry} • {company.company_size} employees
              </div>
              {company.description && (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {company.description.substring(0, 100)}...
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', marginTop: '8px', display: 'inline-block' }}
                >
                  Visit Website →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyBrowser;
