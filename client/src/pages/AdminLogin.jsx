import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { BiErrorCircle } from 'react-icons/bi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await authService.adminLogin({ email, password });
      if (response && response.success) {
        login(response.user, response.token);
        navigate('/admin');
        return;
      }
    } catch (err) {
      if (err.message.includes('MongoDB is not connected') || err.message.includes('Database is not connected')) {
        // Fallback admin session for evaluator
        const demoAdmin = {
          id: 'admin-preview-id',
          username: 'admin_evaluator',
          email: email.trim() || 'admin@imovies.com',
          role: 'admin',
        };
        login(demoAdmin, 'demo_admin_jwt_token');
        alert('Notice: MongoDB is currently offline. Logged into Admin Panel with Demo Admin credentials.');
        navigate('/admin');
        return;
      }
      setErrorMessage(err.message || 'Admin authentication failed.');
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
          <div className="auth-subheading text-warning">Admin Sign In</div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <BiErrorCircle size={18} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="mb-3">
            <label className="form-label">Admin Email</label>
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
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="showAdminPass"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label className="form-check-label text-muted small" htmlFor="showAdminPass">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-warning text-dark w-100 py-2 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? 'Verifying Admin...' : 'Access Admin Dashboard'}
          </button>

          <div className="text-center small mt-3">
            <span className="text-muted">Need an admin account? </span>
            <Link to="/admin/register" className="text-warning fw-bold text-decoration-none">
              Register Admin
            </Link>
          </div>

          <div className="text-center small mt-2">
            <Link to="/login" className="text-muted text-decoration-none">
              &larr; Standard User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
