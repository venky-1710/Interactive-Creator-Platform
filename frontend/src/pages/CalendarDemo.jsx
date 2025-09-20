import React from 'react';
import Calendar from '../components/Calendar';
import './CalendarDemo.css';

const CalendarDemo = () => {
  return (
    <div className="calendar-demo-page">
      <div className="calendar-wrapper">
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarDemo;