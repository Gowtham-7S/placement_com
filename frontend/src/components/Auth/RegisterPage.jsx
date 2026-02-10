import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Alert from '../Common/Alert';
import './Auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    department: '',
    batch_year: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'batch_year' ? parseInt(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await register({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone || undefined,
      department: formData.department || undefined,
      batch_year: formData.batch_year || undefined,
    });

    if (result.success) {
      navigate(formData.role === 'admin' ? '/admin' : formData.role === 'student' ? '/student' : '/junior');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="auth-logo">📊</div>
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            hint="Minimum 8 characters, 1 uppercase, 1 number"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="junior">Junior</option>
              <option value="admin">Admin</option>
            </Input>

            <Input
              label="Batch Year"
              name="batch_year"
              type="number"
              value={formData.batch_year}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Department (Optional)"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="CS, IT, EC, etc."
          />

          <Input
            label="Phone (Optional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91-9876543210"
          />

          <Button
            type="submit"
            label="Create Account"
            loading={loading}
            fullWidth
          />
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
