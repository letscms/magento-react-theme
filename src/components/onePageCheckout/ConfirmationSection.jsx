import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationSection = ({ orderId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-green-50">
        <h2 className="text-lg font-semibold text-green-600">
          <span className="text-green-600">✓ </span>
          Order Confirmation
        </h2>
      </div>
      
      <div className="p-6 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h2>
        
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. We've sent a confirmation email with all the details.
        </p>
        
        {orderId && (
          <div className="mb-6">
            <p className="text-gray-700">
              Your order number is: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please keep this number for your reference.
            </p>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <p className="text-gray-600">
            You can track your order status in your account dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Order
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSection;