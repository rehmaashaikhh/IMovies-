import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { BiErrorCircle } from 'react-icons/bi';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('ADMIN2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await authService.adminRegister({
        username,
        email,
        password,
        securityCode,
      });
      if (response && response.success) {
        login(response.user, response.token);
        navigate('/admin');
        return;
      }
    } catch (err) {
      if (err.message.includes('MongoDB is not connected') || err.message.includes('Database is not connected')) {
        const demoAdmin = {
          id: 'admin-preview-new',
          username: username.trim(),
          email: email.trim(),
          role: 'admin',
        };
        login(demoAdmin, 'demo_admin_jwt_token');
        alert('Notice: MongoDB is currently offline. Logged into Admin Panel via Preview Mode.');
        navigate('/admin');
        return;
      }
      setErrorMessage(err.message || 'Admin registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card border-warning">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-i">i</span>Movies <RiShieldKeyholeLine className="text-warning" size={24} />
          </div>
          <div className="auth-subheading text-warning">Register Admin</div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <BiErrorCircle size={18} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="mb-3">
            <label className="form-label">Admin Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. MasterAdmin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Official Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@imovies.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Security Code</label>
            <input
              type="text"
              className="form-control"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="ADMIN2026"
              required
            />
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Default development security key: <code>ADMIN2026</code>
            </span>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="showAdminRegPass"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label className="form-check-label text-muted small" htmlFor="showAdminRegPass">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-warning text-dark w-100 py-2 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>

          <div className="text-center small mt-3">
            <span className="text-muted">Already an admin? </span>
            <Link to="/admin/login" className="text-warning fw-bold text-decoration-none">
              Admin Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
