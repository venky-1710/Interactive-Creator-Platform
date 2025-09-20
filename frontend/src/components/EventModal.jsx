import React, { useState, useEffect } from 'react';
import { EVENT_TYPES, EVENT_PRIORITIES } from '../services/eventService';
import './EventModal.css';

const EventModal = ({ 
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
    type: EVENT_TYPES.TASK,
    priority: EVENT_PRIORITIES.MEDIUM,
    all_day: false,
    reminder_minutes: 15
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      // Editing existing event
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0],
        time: event.time || '',
        type: event.type || EVENT_TYPES.TASK,
        priority: event.priority || EVENT_PRIORITIES.MEDIUM,
        all_day: event.all_day || false,
        reminder_minutes: event.reminder_minutes || 15
      });
    } else if (selectedDate) {
      // Creating new event for selected date
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
      type: EVENT_TYPES.TASK,
      priority: EVENT_PRIORITIES.MEDIUM,
      all_day: false,
      reminder_minutes: 15
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={handleClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
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
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value={EVENT_TYPES.TASK}>Task</option>
                <option value={EVENT_TYPES.MEETING}>Meeting</option>
                <option value={EVENT_TYPES.REMINDER}>Reminder</option>
                <option value={EVENT_TYPES.BIRTHDAY}>Birthday</option>
                <option value={EVENT_TYPES.HOLIDAY}>Holiday</option>
                <option value={EVENT_TYPES.OTHER}>Other</option>
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
            <label htmlFor="reminder_minutes">Reminder (minutes before)</label>
            <select
              id="reminder_minutes"
              name="reminder_minutes"
              value={formData.reminder_minutes}
              onChange={handleChange}
            >
              <option value={0}>No reminder</option>
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={1440}>1 day</option>
            </select>
          </div>

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

export default EventModal;