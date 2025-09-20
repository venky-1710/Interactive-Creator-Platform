// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};
    
    if (name === 'email') {
      if (!value.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8) {
        errors.password = 'At least 8 characters';
      }
    }
    
    return errors;
  };

  const handleFieldChange = (name, value) => {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Validate if field has been touched
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        ...fieldError,
        [name]: fieldError[name] || undefined
      }));
    }
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = name === 'email' ? email : password;
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      ...fieldError
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailErrors = validateField('email', email);
    const passwordErrors = validateField('password', password);
    const allErrors = { ...emailErrors, ...passwordErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      setTouched({ email: true, password: true });
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic
    console.log('Google sign-in clicked');
  };

  const isFormValid = email.trim() && password && !Object.keys(fieldErrors).length;

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="form-container">
            <h1>Welcome Back 👋</h1>
            <p className="subtitle">Today is a new day. It's your day. You shape it.<br />Sign in to start managing your projects.</p>
            
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Example@email.com"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  className={fieldErrors.email ? 'error' : ''}
                  disabled={loading}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  aria-invalid={!!fieldErrors.email}
                  autoComplete="email"
                  required
                />
                {fieldErrors.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {fieldErrors.email}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    className={fieldErrors.password ? 'error' : ''}
                    disabled={loading}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    aria-invalid={!!fieldErrors.password}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="forgot-password-container">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="sign-in-button" 
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or</span>
            </div>

            <button 
              type="button" 
              className="google-signin-button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            
            <p className="signup-text">
              Don't you have an account? <Link to="/register" className="signup-link">Sign up</Link>
            </p>
            
            <p className="copyright">© 2023 ALL RIGHTS RESERVED</p>
          </div>
        </div>
        
        <div className="login-image-section">
          <div className="image-container">
            {/* You can replace this with an actual image */}
            <div className="floral-background"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;