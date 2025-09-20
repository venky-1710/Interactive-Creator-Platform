// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (name, value, currentFormData = formData) => {
    const errors = {};
    
    if (name === 'username') {
      if (!value.trim()) {
        errors.username = 'Username is required';
      } else if (value.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }
    }
    
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
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (name === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (value !== currentFormData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (name === 'full_name') {
      if (value && value.length < 2) {
        errors.full_name = 'Full name must be at least 2 characters';
      }
    }
    
    return errors;
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Clear field errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = formData[name];
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      ...fieldError
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData); // Debug log
    
    // Basic validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Calling register with:', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name?.trim() || ''
      }); // Debug log
      
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name?.trim() || ''
      });
      
      console.log('Registration successful, navigating to dashboard'); // Debug log
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google sign-up logic
    console.log('Google sign-up clicked');
  };

  const isFormValid = formData.username.trim() && 
                     formData.email.trim() && 
                     formData.password && 
                     formData.confirmPassword &&
                     formData.password === formData.confirmPassword &&
                     Object.keys(fieldErrors).length === 0;

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="form-container">
            <h1>Join PraxisCode 🚀</h1>
            <p className="subtitle">Create your account to start your coding journey.<br />Sign up to access challenges, track progress, and join our community.</p>
            
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  onBlur={() => handleFieldBlur('username')}
                  className={fieldErrors.username ? 'error' : ''}
                  disabled={loading}
                  aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                  aria-invalid={!!fieldErrors.username}
                  autoComplete="username"
                  required
                />
                {fieldErrors.username && (
                  <span id="username-error" className="field-error" role="alert">
                    {fieldErrors.username}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Example@email.com"
                  value={formData.email}
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
                <label htmlFor="full_name">Full Name (Optional)</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => handleFieldChange('full_name', e.target.value)}
                  onBlur={() => handleFieldBlur('full_name')}
                  className={fieldErrors.full_name ? 'error' : ''}
                  disabled={loading}
                  aria-describedby={fieldErrors.full_name ? 'full_name-error' : undefined}
                  aria-invalid={!!fieldErrors.full_name}
                  autoComplete="name"
                />
                {fieldErrors.full_name && (
                  <span id="full_name-error" className="field-error" role="alert">
                    {fieldErrors.full_name}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="At least 8 characters with mixed case and numbers"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    className={fieldErrors.password ? 'error' : ''}
                    disabled={loading}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    aria-invalid={!!fieldErrors.password}
                    autoComplete="new-password"
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
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className={fieldErrors.confirmPassword ? 'error' : ''}
                    disabled={loading}
                    aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                    aria-invalid={!!fieldErrors.confirmPassword}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span id="confirmPassword-error" className="field-error" role="alert">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
              
              <button 
                type="submit" 
                className="sign-in-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or</span>
            </div>

            <button 
              type="button" 
              className="google-signin-button"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            
            <p className="signup-text">
              Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
            </p>
            
            <p className="copyright">© 2023 ALL RIGHTS RESERVED</p>
          </div>
        </div>
        
        <div className="login-image-section">
          <div className="image-container">
            <div className="floral-background register-background"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;