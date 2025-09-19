// src/components/admin/UserModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, onSubmit, user = null, title, submitText }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || 'user',
        password: '' // Password field empty for editing
      });
    } else {
      setFormData({
        username: '',
        email: '',
        full_name: '',
        role: 'user',
        password: ''
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'Password is required for new users';
    } else if (!user && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">
                <User size={16} />
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                placeholder="Enter username"
              />
              {errors.username && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
              />
              {errors.email && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group span-2">
              <label htmlFor="full_name">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <Shield size={16} />
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.role}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Password {!user && '*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder={user ? "Leave blank to keep current password" : "Enter password"}
              />
              {errors.password && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
