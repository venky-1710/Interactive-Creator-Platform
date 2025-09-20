// src/services/eventService.js
import api from './api';

const EVENT_ENDPOINTS = {
  EVENTS: '/events',
  USER_EVENTS: '/user/events',
  ADMIN_EVENTS: '/admin/events',
  PUBLIC_EVENTS: '/public/events'
};

// Get all events for the current user
export const getUserEvents = async () => {
  try {
    const response = await api.get(EVENT_ENDPOINTS.USER_EVENTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};

// Get events for a specific date range
export const getEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(`${EVENT_ENDPOINTS.USER_EVENTS}`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};

// Get events for a specific date
export const getEventsByDate = async (date) => {
  try {
    const response = await api.get(`${EVENT_ENDPOINTS.USER_EVENTS}`, {
      params: {
        date: date
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by date:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post(EVENT_ENDPOINTS.EVENTS, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`${EVENT_ENDPOINTS.EVENTS}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`${EVENT_ENDPOINTS.EVENTS}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get a specific event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`${EVENT_ENDPOINTS.EVENTS}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Event types/categories
export const EVENT_TYPES = {
  TASK: 'task',
  MEETING: 'meeting',
  REMINDER: 'reminder',
  BIRTHDAY: 'birthday',
  HOLIDAY: 'holiday',
  OTHER: 'other'
};

// Event priority levels
export const EVENT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Format date for API calls
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

// Parse date from API response
export const parseDateFromAPI = (dateString) => {
  return new Date(dateString);
};

// ========================= ADMIN EVENT FUNCTIONS =========================

// Get all admin events (admin only)
export const getAdminEvents = async () => {
  try {
    const response = await api.get(EVENT_ENDPOINTS.ADMIN_EVENTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin events:', error);
    throw error;
  }
};

// Get admin events for a specific date range (admin only)
export const getAdminEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(EVENT_ENDPOINTS.ADMIN_EVENTS, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin events by date range:', error);
    throw error;
  }
};

// Get public events (available to all users)
export const getPublicEvents = async () => {
  try {
    const response = await api.get(EVENT_ENDPOINTS.PUBLIC_EVENTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }
};

// Get public events for a specific date range
export const getPublicEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(EVENT_ENDPOINTS.PUBLIC_EVENTS, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching public events by date range:', error);
    throw error;
  }
};

// Create a new admin event (admin only)
export const createAdminEvent = async (eventData) => {
  try {
    const response = await api.post(EVENT_ENDPOINTS.ADMIN_EVENTS, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin event:', error);
    throw error;
  }
};

// Update an existing admin event (admin only)
export const updateAdminEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`${EVENT_ENDPOINTS.ADMIN_EVENTS}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin event:', error);
    throw error;
  }
};

// Delete an admin event (admin only)
export const deleteAdminEvent = async (eventId) => {
  try {
    const response = await api.delete(`${EVENT_ENDPOINTS.ADMIN_EVENTS}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin event:', error);
    throw error;
  }
};

// Get a specific admin event by ID (admin only)
export const getAdminEventById = async (eventId) => {
  try {
    const response = await api.get(`${EVENT_ENDPOINTS.ADMIN_EVENTS}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin event:', error);
    throw error;
  }
};

// Admin Event types/categories
export const ADMIN_EVENT_TYPES = {
  ANNOUNCEMENT: 'announcement',
  HOLIDAY: 'holiday',
  MAINTENANCE: 'maintenance',
  DEADLINE: 'deadline',
  OTHER: 'other'
};

// Get combined events (user + public events)
export const getAllEventsForUser = async (startDate, endDate) => {
  try {
    console.log('Fetching events for date range:', startDate, 'to', endDate);
    
    const [userEvents, publicEvents] = await Promise.all([
      getEventsByDateRange(startDate, endDate),
      getPublicEventsByDateRange(startDate, endDate)
    ]);

    console.log('User events:', userEvents);
    console.log('Public events:', publicEvents);

    // Mark admin events as such for UI distinction
    const markedPublicEvents = publicEvents.map(event => ({
      ...event,
      isAdminEvent: true,
      isReadOnly: true
    }));

    const combinedEvents = [...userEvents, ...markedPublicEvents];
    console.log('Combined events:', combinedEvents);
    
    return combinedEvents;
  } catch (error) {
    console.error('Error fetching all events for user:', error);
    // If public events fail, still return user events
    try {
      const fallbackEvents = await getEventsByDateRange(startDate, endDate);
      console.log('Fallback to user events only:', fallbackEvents);
      return fallbackEvents;
    } catch (userEventError) {
      console.error('Error fetching user events as fallback:', userEventError);
      throw error;
    }
  }
};