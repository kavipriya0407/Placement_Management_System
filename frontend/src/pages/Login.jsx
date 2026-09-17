import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, Lock, User as UserIcon, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';

const Login = ({ initialRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Determine portal from prop or URL (/admin/login vs /student/login or /login)
  const isUrlAdmin = location.pathname.includes('/admin');
  const [portalRole, setPortalRole] = useState(initialRole || (isUrlAdmin ? 'admin' : 'student'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setPortalRole('admin');
    } else if (location.pathname.includes('/student')) {
      setPortalRole('student');
    }
  }, [location.pathname]);

  const handleSwitchPortal = (role) => {
    setPortalRole(role);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userData = await login(username.trim(), password);

      // Check portal role match
      if (portalRole === 'admin') {
        if (userData.role !== 'admin') {
          setError('Access Denied: This account is a student account. Please use the Student Portal to sign in.');
          setLoading(false);
          return;
        }
        navigate('/admin/dashboard');
      } else {
        if (userData.role === 'admin') {
          // If admin logged into student portal, redirect them to admin dashboard
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    if (portalRole === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('21IT001');
      setPassword('student123');
    }
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Portal Switcher Tabs */}
        <div className="portal-tabs">
          <button
            type="button"
            className={`portal-tab student-tab ${portalRole === 'student' ? 'active' : ''}`}
            onClick={() => handleSwitchPortal('student')}
          >
            <GraduationCap size={18} />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            className={`portal-tab admin-tab ${portalRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleSwitchPortal('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Portal Header */}
        <div className="auth-header">
          <div
            className="auth-logo"
            style={{
              background: portalRole === 'admin'
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              boxShadow: portalRole === 'admin'
                ? '0 8px 16px rgba(79, 70, 229, 0.35)'
                : '0 8px 16px rgba(5, 150, 105, 0.35)',
            }}
          >
            {portalRole === 'admin' ? <ShieldCheck size={28} /> : <GraduationCap size={28} />}
          </div>
          <h2 className="auth-title">
            {portalRole === 'admin' ? 'Placement Officer Login' : 'Student Career Portal'}
          </h2>
          <p className="auth-subtitle">
            {portalRole === 'admin'
              ? 'Administrative Control Panel & Campus Recruiter Portal'
              : 'Sign in to explore campus drives, apply, and track offers'}
          </p>
        </div>

        {/* Academic Viva Demo Autofill */}
        <div className="demo-creds-container">
          <div className="demo-title">
            <ShieldCheck size={14} color="var(--primary-600)" />
            <span>Academic Viva / Demo One-Click Login</span>
          </div>
          <button
            type="button"
            className="demo-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '8px 12px' }}
            onClick={handleFillDemo}
            title={portalRole === 'admin' ? 'Autofill Admin Credentials' : 'Autofill Student Credentials'}
          >
            {portalRole === 'admin'
              ? '🛡️ Autofill Officer Account (admin / admin123)'
              : '🎓 Autofill Student Account (21IT001 / student123)'}
          </button>
        </div>

        <AlertBanner type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {portalRole === 'admin' ? 'Placement Officer Username / Email' : 'Register Number or Student Email'}{' '}
              <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder={portalRole === 'admin' ? 'e.g. admin or officer@placement.edu' : 'e.g. 21IT001 or student@college.edu'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              background: portalRole === 'admin'
                ? 'var(--primary-600)'
                : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              borderColor: portalRole === 'admin' ? 'var(--primary-600)' : '#059669'
            }}
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {portalRole === 'admin' ? 'Sign In as Placement Officer' : 'Sign In to Student Portal'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch Links */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--slate-500)' }}>
          {portalRole === 'admin' ? (
            <div>
              <span>Are you a student? </span>
              <button
                type="button"
                onClick={() => handleSwitchPortal('student')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Go to Student Portal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span>New student? </span>
                <Link to="/register" style={{ fontWeight: 600, color: '#059669' }}>
                  Register for Placements
                </Link>
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <span>Placement Officer? </span>
                <button
                  type="button"
                  onClick={() => handleSwitchPortal('admin')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Admin Portal Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
