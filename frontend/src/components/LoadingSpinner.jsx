// src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...',
  overlay = false,
  color = 'blue' 
}) {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size];

  const Component = (
    <div className="loading-container">
      <div className="flex flex-col items-center">
        <Loader2 className={`animate-spin ${sizeClass} text-${color}-500`} />
        {message && <p className="loading-message mt-2 text-gray-600">{message}</p>}
      </div>
    </div>
  );

  return overlay ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {Component}
      </div>
    </div>
  ) : Component;
}

export default LoadingSpinner;