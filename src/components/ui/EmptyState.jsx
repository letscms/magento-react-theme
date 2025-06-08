import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  actionLink, 
  icon: Icon 
}) => {
  return (
    <div className="text-center py-12 px-4">
      {Icon && (
        <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
          <Icon className="w-full h-full" />
        </div>
      )}
      
      {!Icon && (
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      
      {actionText && actionLink && (
        <div className="mt-6">
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;