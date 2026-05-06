import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [currentRole, setCurrentRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (role: string, event: React.MouseEvent<HTMLDivElement>) => {
    // Update role selection UI
    const roleTabs = document.querySelectorAll('.role-tab');
    roleTabs.forEach(tab => tab.classList.remove('active'));
    (event.currentTarget as HTMLElement).classList.add('active');
    setCurrentRole(role);
  };

  const showToast = (icon: string, msg: string, color: string) => {
    const toastArea = document.createElement('div');
    toastArea.id = 'toastArea';
    toastArea.style.cssText = 'position:fixed;bottom:30px;right:30px;z-index:9999;display:flex;flex-direction:column;gap:12px;';
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `background:rgba(28,28,30,.95);backdrop-filter:blur(20px);border:1px solid ${color}55;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:12px;min-width:280px;animation:slideIn .4s ease;font-size:.9rem;`;
    toast.innerHTML = `<span style="font-size:1.3rem">${icon}</span> ${msg}`;
    
    toastArea.appendChild(toast);
    document.body.appendChild(toastArea);
    
    setTimeout(() => {
      toast.remove();
      if (toastArea.children.length === 0) {
        toastArea.remove();
      }
    }, 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      
      // Show success message
      showToast("✅", `Welcome back! Logged in as ${currentRole}.`, "#00C9A7");
      
      // Navigate based on role after successful login
      setTimeout(() => {
        if (currentRole === 'admin') {
          navigate('/reports');
        } else if (currentRole === 'staff') {
          navigate('/orders');
        } else {
          navigate('/menu');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast("❌", err.message || 'Login failed. Please try again.', "#FF6B2B");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side with branding and visuals */}
      <div className="auth-left">
        <Link to="/" className="auth-brand">Canteen<span>Go</span></Link>
        <div className="auth-visual">
          <h2 className="auth-big-text">
            Your Meal,<br /><span className="line2">Your Way,</span><br />Right Now.
          </h2>
          <p className="auth-sub">
            Sign in to access your personalized canteen experience. Order smarter,
            eat better.
          </p>
          <div className="auth-food-imgs">
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
            <div className="auth-food-img">
              <img
                src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop"
                alt="Food"
              />
            </div>
          </div>
        </div>
        <div className="auth-left-footer">© 2024 CanteenGo · All rights reserved</div>
      </div>

      {/* Right side with login form */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="section-title">Welcome Back</div>
          <div className="section-sub">Choose your role to continue</div>

          {/* Login Tab */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                // Don't navigate here since we're already on the login page
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                navigate('/register');
              }}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  className="form-control-custom"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon">
               
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control-custom"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-pw`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
            <div className="check-row">
              <input type="checkbox" style={{ accentColor: 'var(--saffron)' }} />
              <label>Remember me</label>
            </div>
            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>
            {error && (
              <div className="error-message" style={{
                color: '#ff4444',
                fontSize: '0.85rem',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 68, 68, 0.3)'
              }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Login to CanteenGo
                </>
              )}
            </button>
            <div className="divider"><span>or continue with</span></div>
            <div className="social-login">
              <button type="button" className="btn-social">
                <img src="https://www.google.com/favicon.ico" width="16" /> Google
              </button>
              <button type="button" className="btn-social">
                <i className="fab fa-facebook-f" style={{ color: '#1877f2' }}></i> Facebook
              </button>
            </div>
            <div className="switch-mode">
              Don't have an account?{' '}
              <a href="#" onClick={() => navigate('/register')}>Sign up free</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
