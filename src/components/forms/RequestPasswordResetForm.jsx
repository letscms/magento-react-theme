import React, { useState } from 'react';
import authService from '../../api/auth.jsx'; // Corrected import path
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function RequestPasswordResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      // The API returns true on success or throws an error
      await authService.requestPasswordReset(email);
      setMessage('If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).');
      setEmail(''); // Clear the email field on success
    } catch (err) {
      // Attempt to parse Magento's error structure if possible
      const apiErrorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
      setError("This email does not exist. Please check and try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {message && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'Send Password Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestPasswordResetForm;