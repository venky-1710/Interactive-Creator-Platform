// src/components/admin/ChallengeModal.jsx
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Target, Clock, Star, AlertCircle, Tag } from 'lucide-react';
import './UserModal.css'; // Reuse the same styles

const ChallengeModal = ({ isOpen, onClose, onSubmit, challenge = null, title, submitText }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: '',
    points: 100,
    time_limit: 60,
    problem_statement: '',
    sample_input: '',
    sample_output: '',
    constraints: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (challenge) {
      setFormData({
        title: challenge.title || '',
        description: challenge.description || '',
        difficulty: challenge.difficulty || 'easy',
        category: challenge.category || '',
        points: challenge.points || 100,
        time_limit: challenge.time_limit || 60,
        problem_statement: challenge.problem_statement || '',
        sample_input: challenge.sample_input || '',
        sample_output: challenge.sample_output || '',
        constraints: challenge.constraints || '',
        tags: Array.isArray(challenge.tags) ? challenge.tags.join(', ') : (challenge.tags || '')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        category: '',
        points: 100,
        time_limit: 60,
        problem_statement: '',
        sample_input: '',
        sample_output: '',
        constraints: '',
        tags: ''
      });
    }
    setErrors({});
  }, [challenge, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.problem_statement.trim()) {
      newErrors.problem_statement = 'Problem statement is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.points < 10 || formData.points > 1000) {
      newErrors.points = 'Points must be between 10 and 1000';
    }

    if (formData.time_limit < 1 || formData.time_limit > 180) {
      newErrors.time_limit = 'Time limit must be between 1 and 180 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await onSubmit(submitData);
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
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="title">
                <BookOpen size={16} />
                Challenge Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter challenge title"
              />
              {errors.title && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">
                <Star size={16} />
                Difficulty *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={errors.difficulty ? 'error' : ''}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">
                <Tag size={16} />
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
                placeholder="e.g., Arrays, Algorithms"
              />
              {errors.category && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.category}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="points">
                <Target size={16} />
                Points
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className={errors.points ? 'error' : ''}
                min="10"
                max="1000"
              />
              {errors.points && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.points}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="time_limit">
                <Clock size={16} />
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="time_limit"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleChange}
                className={errors.time_limit ? 'error' : ''}
                min="1"
                max="180"
              />
              {errors.time_limit && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.time_limit}
                </span>
              )}
            </div>

            <div className="form-group span-2">
              <label htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Brief description of the challenge"
                rows="3"
                style={{ resize: 'vertical', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              {errors.description && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.description}
                </span>
              )}
            </div>

            <div className="form-group span-2">
              <label htmlFor="problem_statement">
                Problem Statement *
              </label>
              <textarea
                id="problem_statement"
                name="problem_statement"
                value={formData.problem_statement}
                onChange={handleChange}
                className={errors.problem_statement ? 'error' : ''}
                placeholder="Detailed problem statement"
                rows="4"
                style={{ resize: 'vertical', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              {errors.problem_statement && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.problem_statement}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sample_input">
                Sample Input
              </label>
              <textarea
                id="sample_input"
                name="sample_input"
                value={formData.sample_input}
                onChange={handleChange}
                placeholder="Sample input for the problem"
                rows="3"
                style={{ resize: 'vertical', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sample_output">
                Sample Output
              </label>
              <textarea
                id="sample_output"
                name="sample_output"
                value={formData.sample_output}
                onChange={handleChange}
                placeholder="Expected output for sample input"
                rows="3"
                style={{ resize: 'vertical', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <div className="form-group span-2">
              <label htmlFor="constraints">
                Constraints
              </label>
              <textarea
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                placeholder="Problem constraints and limits"
                rows="2"
                style={{ resize: 'vertical', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <div className="form-group span-2">
              <label htmlFor="tags">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags separated by commas (e.g., arrays, sorting, dynamic programming)"
              />
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

export default ChallengeModal;
