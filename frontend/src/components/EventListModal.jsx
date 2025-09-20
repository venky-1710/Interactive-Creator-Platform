import React from 'react';
import './EventListModal.css';

const EventListModal = ({ 
  isOpen, 
  onClose, 
  events, 
  selectedDate, 
  onAddNewEvent, 
  onEditEvent,
  onDeleteEvent 
}) => {
  if (!isOpen) return null;

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Events for {formatDate(selectedDate)}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {events.length === 0 ? (
            <div className="no-events">
              <p>No events for this day</p>
            </div>
          ) : (
            <div className="events-list">
              {events.map((event, index) => (
                <div key={index} className={`event-item ${event.isAdminEvent ? 'admin-event' : 'user-event'}`}>
                  <div className="event-header">
                    <h3 className="event-title">
                      {event.isAdminEvent && <span className="admin-badge">Admin</span>}
                      {event.title}
                    </h3>
                    <div className="event-actions">
                      {!event.isAdminEvent && (
                        <>
                          <button 
                            className="edit-btn"
                            onClick={() => onEditEvent(event)}
                            title="Edit event"
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => onDeleteEvent(event)}
                            title="Delete event"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {event.time && (
                    <div className="event-time">
                      <span className="time-icon">🕐</span>
                      {formatTime(event.time)}
                    </div>
                  )}
                  
                  {event.description && (
                    <div className="event-description">
                      {event.description}
                    </div>
                  )}
                  
                  <div className="event-priority">
                    <span className={`priority-badge priority-${event.priority || 'medium'}`}>
                      {(event.priority || 'medium').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="add-event-btn" onClick={onAddNewEvent}>
            <span className="plus-icon">+</span>
            Add {events.length > 0 ? 'Another' : 'New'} Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListModal;