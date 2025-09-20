import React, { useState, useEffect } from 'react';
import { ADMIN_EVENT_TYPES, EVENT_PRIORITIES } from '../services/eventService';
import './AdminEventModal.css';

const AdminEventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  event = null, 
  selectedDate = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: ADMIN_EVENT_TYPES.ANNOUNCEMENT,
    priority: EVENT_PRIORITIES.MEDIUM,
    all_day: false,
    is_public: true,
    target_users: []
  });

  const [errors, setErrors] = useState({});
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (event) {
      // Editing existing admin event
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0],
        time: event.time || '',
        type: event.type || ADMIN_EVENT_TYPES.ANNOUNCEMENT,
        priority: event.priority || EVENT_PRIORITIES.MEDIUM,
        all_day: event.all_day || false,
        is_public: event.is_public !== undefined ? event.is_public : true,
        target_users: event.target_users || []
      });
    } else if (selectedDate) {
      // Creating new admin event for selected date
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [event, selectedDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.all_day && !formData.time) {
      newErrors.time = 'Time is required for non-all-day events';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const eventData = {
      ...formData,
      id: event?.id
    };
    
    onSave(eventData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: ADMIN_EVENT_TYPES.ANNOUNCEMENT,
      priority: EVENT_PRIORITIES.MEDIUM,
      all_day: false,
      is_public: true,
      target_users: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-event-modal-overlay" onClick={handleClose}>
      <div className="admin-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-event-modal-header">
          <h2>{event ? 'Edit Admin Event' : 'Create Admin Event'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <form className="admin-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description (optional)"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group half">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={formData.all_day}
                className={errors.time ? 'error' : ''}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="all_day"
                checked={formData.all_day}
                onChange={handleChange}
              />
              All day event
            </label>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="type">Event Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value={ADMIN_EVENT_TYPES.ANNOUNCEMENT}>Announcement</option>
                <option value={ADMIN_EVENT_TYPES.HOLIDAY}>Holiday</option>
                <option value={ADMIN_EVENT_TYPES.MAINTENANCE}>Maintenance</option>
                <option value={ADMIN_EVENT_TYPES.DEADLINE}>Deadline</option>
                <option value={ADMIN_EVENT_TYPES.OTHER}>Other</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value={EVENT_PRIORITIES.LOW}>Low</option>
                <option value={EVENT_PRIORITIES.MEDIUM}>Medium</option>
                <option value={EVENT_PRIORITIES.HIGH}>High</option>
                <option value={EVENT_PRIORITIES.URGENT}>Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
              />
              Visible to all users
            </label>
            <small className="form-help">
              If unchecked, you can specify target users below
            </small>
          </div>

          {!formData.is_public && (
            <div className="form-group">
              <label htmlFor="target_users">Target Users (Optional)</label>
              <textarea
                id="target_users"
                name="target_users"
                value={formData.target_users.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  target_users: e.target.value.split(',').map(id => id.trim()).filter(id => id)
                }))}
                placeholder="Enter user IDs separated by commas (leave empty for no specific targets)"
                rows="2"
              />
              <small className="form-help">
                Leave empty to show to no users, or enter specific user IDs
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventModal;