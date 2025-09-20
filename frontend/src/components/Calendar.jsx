import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserEvents, getEventsByDateRange, createEvent, updateEvent, deleteEvent, formatDateForAPI, getAllEventsForUser } from '../services/eventService';
import EventModal from './EventModal';
import EventDetails from './EventDetails';
import EventListModal from './EventListModal';
import Toast from './Toast';
import './Calendar.css';

const Calendar = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  // Event-related state
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventListModal, setShowEventListModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Load events when component mounts or month changes
  useEffect(() => {
    if (isAuthenticated) {
      loadMonthEvents();
    }
  }, [currentMonth, currentYear, isAuthenticated]);

  const loadMonthEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      
      console.log('Loading events for date range:', formatDateForAPI(startDate), 'to', formatDateForAPI(endDate));
      
      // Get both user events and admin events
      const allEvents = await getAllEventsForUser(
        formatDateForAPI(startDate),
        formatDateForAPI(endDate)
      );
      
      console.log('📊 Received events from API:', allEvents);
      console.log('📊 Total events count:', allEvents?.length || 0);
      if (allEvents && allEvents.length > 0) {
        const userEvents = allEvents.filter(e => !e.isAdminEvent);
        const adminEvents = allEvents.filter(e => e.isAdminEvent);
        console.log('👤 User events:', userEvents.length);
        console.log('🔧 Admin events:', adminEvents.length);
      }
      
      console.log('Loaded events:', allEvents);
      setEvents(allEvents || []);
    } catch (error) {
      console.error('Error loading events:', error);
      showToast('Failed to load events', 'error');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Get events for a specific date
  const getEventsForDate = (year, month, day) => {
    const dateString = formatDateForAPI(new Date(year, month, day));
    const dayEvents = events.filter(event => event.date === dateString);
    
    if (dayEvents.length > 0) {
      console.log(`📅 Events for ${dateString}:`, dayEvents);
    }
    
    return dayEvents;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    const calendarDays = [];
    
    // Add previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dayEvents = getEventsForDate(currentYear, currentMonth - 1, day);
      calendarDays.push({
        day: day,
        isCurrentMonth: false,
        isDisabled: true,
        events: dayEvents,
        date: new Date(currentYear, currentMonth - 1, day)
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(currentYear, currentMonth, day);
      calendarDays.push({
        day: day,
        isCurrentMonth: true,
        isDisabled: false,
        isToday: day === currentDate.getDate() && 
                currentMonth === new Date().getMonth() && 
                currentYear === new Date().getFullYear(),
        events: dayEvents,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    // Add next month's leading days to complete the grid (35 days total)
    const remainingDays = 35 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dayEvents = getEventsForDate(currentYear, currentMonth + 1, day);
      calendarDays.push({
        day: day,
        isCurrentMonth: false,
        isDisabled: true,
        events: dayEvents,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Event handlers
  const handleDayClick = (dayObj, event) => {
    if (!isAuthenticated) {
      showToast('Please login to manage events', 'warning');
      return;
    }

    // Set selected date and events for the day
    setSelectedDate(dayObj.date);
    setSelectedDayEvents(dayObj.events || []);
    
    // Always show the event list modal for the day
    setShowEventListModal(true);
  };

  // Handler for event indicators
  const handleEventIndicatorClick = (dayObj, eventIndex, event) => {
    event.stopPropagation();
    if (dayObj.events && dayObj.events[eventIndex]) {
      setSelectedEvent(dayObj.events[eventIndex]);
      setShowEventDetails(true);
    }
  };

  // Handler for adding new event from EventListModal
  const handleAddNewEventFromList = () => {
    setShowEventListModal(false);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Handler for editing event from EventListModal
  const handleEditEventFromList = (event) => {
    setShowEventListModal(false);
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handler for deleting event from EventListModal
  const handleDeleteEventFromList = async (eventToDelete) => {
    try {
      await deleteEvent(eventToDelete._id);
      showToast('Event deleted successfully', 'success');
      loadMonthEvents(); // Reload events
      
      // Update the selected day events list
      const updatedEvents = selectedDayEvents.filter(e => e._id !== eventToDelete._id);
      setSelectedDayEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      setLoading(true);
      await createEvent(eventData);
      await loadMonthEvents();
      setShowEventModal(false);
      setSelectedDate(null);
      showToast('Event created successfully!', 'success');
      
      // If we came from the event list modal, refresh the selected day events
      if (showEventListModal) {
        const dateString = formatDateForAPI(selectedDate);
        const updatedDayEvents = events.filter(event => event.date === dateString);
        setSelectedDayEvents(updatedDayEvents);
        setShowEventListModal(true);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showToast('Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      setLoading(true);
      await updateEvent(eventData.id, eventData);
      await loadMonthEvents();
      setShowEventModal(false);
      setSelectedEvent(null);
      showToast('Event updated successfully!', 'success');
      
      // If we came from the event list modal, refresh the selected day events
      if (showEventListModal) {
        const dateString = formatDateForAPI(selectedDate);
        const updatedDayEvents = events.filter(event => event.date === dateString);
        setSelectedDayEvents(updatedDayEvents);
        setShowEventListModal(true);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('Failed to update event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteEvent(eventId);
      await loadMonthEvents();
      setShowEventDetails(false);
      setSelectedEvent(null);
      showToast('Event deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(false);
    setShowEventModal(true);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-frame">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
          <div className="cloud cloud_top cloud_slow"></div>
          <div className="cloud cloud_bottom cloud_fast"></div>
          <div className="moon"></div>
          <div className="tree tree_dark-green tree_middle"></div>
          <div className="mountain mountain_dark mountain_top"></div>
          <div className="tree tree_dark-green tree_right"></div>
          <div className="mountain mountain_light mountain_right"></div>
          <div className="tree tree_light-green tree_left"></div>
          <div className="mountain mountain_light mountain_left"></div>
        </div>
      </div>
      
      <div className="calendar">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateMonth('prev')}>‹</button>
          <div className="header-content">
            <h1 className="header_title">{monthNames[currentMonth]}</h1>
            <p className="header_subtitle">{currentYear}</p>
          </div>
          <button className="nav-button" onClick={() => navigateMonth('next')}>›</button>
        </div>
        
        <div className="days-of-week">
          {daysOfTheWeek.map((dayName, index) => (
            <p key={index} className="day-name">{dayName}</p>
          ))}
        </div>
        
        <div className="days">
          {calendarDays.map((dayObj, index) => (
            <div 
              key={index} 
              className={`day-cell ${dayObj.isDisabled ? 'day-cell_disabled' : ''} ${dayObj.isToday ? 'day-cell_today' : ''} ${dayObj.events && dayObj.events.length > 0 ? 'has-events' : ''}`}
              onClick={(e) => handleDayClick(dayObj, e)}
            >
              <span className={`day-number ${dayObj.isDisabled ? 'day-number_disabled' : ''} ${dayObj.isToday ? 'day-number_today' : ''}`}>
                {dayObj.day}
              </span>
              {dayObj.events && dayObj.events.length > 0 && (
                <div className="event-indicators">
                  {dayObj.events.slice(0, 3).map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className={`event-dot event-${event.priority || 'medium'} ${event.isAdminEvent ? 'admin-event' : ''}`}
                      title={`${event.isAdminEvent ? '[Admin] ' : ''}${event.title}`}
                      onClick={(e) => handleEventIndicatorClick(dayObj, eventIndex, e)}
                    />
                  ))}
                  {dayObj.events.length > 3 && (
                    <div 
                      className="event-more"
                      title={`+${dayObj.events.length - 3} more events - Click to see all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(dayObj.events[0]);
                        setShowEventDetails(true);
                      }}
                    >
                      +{dayObj.events.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Event List Modal */}
      <EventListModal
        isOpen={showEventListModal}
        onClose={() => {
          setShowEventListModal(false);
          setSelectedDate(null);
          setSelectedDayEvents([]);
        }}
        events={selectedDayEvents}
        selectedDate={selectedDate}
        onAddNewEvent={handleAddNewEventFromList}
        onEditEvent={handleEditEventFromList}
        onDeleteEvent={handleDeleteEventFromList}
      />

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedDate(null);
          setSelectedEvent(null);
        }}
        onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />

      {/* Event Details Modal */}
      <EventDetails
        isOpen={showEventDetails}
        onClose={() => {
          setShowEventDetails(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="calendar-loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Calendar;