import React, { memo } from 'react';

const LoadingSpinner = ({ size = 'large', color = 'indigo' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const colorClasses = {
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500',
    gray: 'border-gray-500'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${spinnerColor}`}></div>
  );
};

const FullScreenLoader = ({ size, color }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm z-50">
      <LoadingSpinner size={size} color={color} />
    </div>
  );
};

export default memo(FullScreenLoader);
