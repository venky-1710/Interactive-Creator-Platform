import React from 'react';
import { EVENT_TYPES, EVENT_PRIORITIES } from '../services/eventService';
import './EventDetails.css';

const EventDetails = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  event 
}) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case EVENT_TYPES.TASK: return '✓';
      case EVENT_TYPES.MEETING: return '👥';
      case EVENT_TYPES.REMINDER: return '🔔';
      case EVENT_TYPES.BIRTHDAY: return '🎂';
      case EVENT_TYPES.HOLIDAY: return '🎉';
      default: return '📅';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case EVENT_PRIORITIES.URGENT: return '#ff4757';
      case EVENT_PRIORITIES.HIGH: return '#ff6b35';
      case EVENT_PRIORITIES.MEDIUM: return '#ffa502';
      case EVENT_PRIORITIES.LOW: return '#7bed9f';
      default: return '#70a1ff';
    }
  };

  const getReminderText = (minutes) => {
    if (minutes === 0) return 'No reminder';
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes < 1440) return `${minutes / 60} hour${minutes / 60 > 1 ? 's' : ''} before`;
    return `${minutes / 1440} day${minutes / 1440 > 1 ? 's' : ''} before`;
  };

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details" onClick={(e) => e.stopPropagation()}>
        <div className="event-details-header">
          <div className="event-title-section">
            <span className="event-type-icon">{getTypeIcon(event.type)}</span>
            <h2 className="event-title">{event.title}</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="event-details-content">
          <div className="event-meta">
            <div className="event-meta-item">
              <span className="meta-label">Date:</span>
              <span className="meta-value">{formatDate(event.date)}</span>
            </div>

            {!event.all_day && event.time && (
              <div className="event-meta-item">
                <span className="meta-label">Time:</span>
                <span className="meta-value">{formatTime(event.time)}</span>
              </div>
            )}

            {event.all_day && (
              <div className="event-meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">All day</span>
              </div>
            )}

            <div className="event-meta-item">
              <span className="meta-label">Type:</span>
              <span className="meta-value event-type">
                {getTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            </div>

            <div className="event-meta-item">
              <span className="meta-label">Priority:</span>
              <span 
                className="meta-value event-priority" 
                style={{ color: getPriorityColor(event.priority) }}
              >
                {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
              </span>
            </div>

            <div className="event-meta-item">
              <span className="meta-label">Reminder:</span>
              <span className="meta-value">{getReminderText(event.reminder_minutes)}</span>
            </div>
          </div>

          {event.description && (
            <div className="event-description">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>
          )}
        </div>

        <div className="event-details-actions">
          {event.isAdminEvent ? (
            <div className="admin-event-notice">
              <span className="admin-badge">Admin Event</span>
              <p>This event was created by an administrator and cannot be modified.</p>
            </div>
          ) : (
            <>
              <button className="edit-button" onClick={() => onEdit(event)}>
                Edit Event
              </button>
              <button className="delete-button" onClick={() => onDelete(event.id)}>
                Delete Event
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;