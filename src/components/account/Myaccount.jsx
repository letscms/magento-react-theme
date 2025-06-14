import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiMail, FiLock, FiEdit, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

function MyAccount() {
  const { currentUser, loading, error, updateName, updateEmail, updatePassword } = useAuth();

  // State for managing edit modes
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Form states
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [nameUpdateStatus, setNameUpdateStatus] = useState({ loading: false, error: null, success: false });
  const [emailUpdateStatus, setEmailUpdateStatus] = useState({ loading: false, error: null, success: false });
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState({ loading: false, error: null, success: false });

  // Simple debounce implementation
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Update form states when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setNewFirstName(currentUser.firstname || '');
      setNewLastName(currentUser.lastname || '');
      setNewEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Get full name from first and last name
  const getFullName = useCallback(() => {
    if (!currentUser) return '';
    return `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim();
  }, [currentUser]);

  // Handle name update with debouncing
  const handleNameUpdate = useCallback(
    debounce(async () => {
      if (!newFirstName.trim() || !newLastName.trim()) {
        setNameUpdateStatus({
          loading: false,
          error: 'First name and last name cannot be empty',
          success: false,
        });
        return;
      }

      setNameUpdateStatus({ loading: true, error: null, success: false });

      try {
        const result = await updateName({
          firstname: newFirstName.trim(),
          lastname: newLastName.trim(),
          email: currentUser.email,
        });
        if (result.success) {
          setNameUpdateStatus({ loading: false, error: null, success: true });
          setEditName(false);
          setTimeout(() => {
            setNameUpdateStatus((prev) => ({ ...prev, success: false }));
          }, 3000);
        } else {
          setNameUpdateStatus({
            loading: false,
            error: result.error || 'Failed to update name',
            success: false,
          });
        }
      } catch (err) {
        setNameUpdateStatus({
          loading: false,
          error: err.message || 'Failed to update name',
          success: false,
        });
      }
    }, 300),
    [newFirstName, newLastName, currentUser]
  );

  // Handle email update with debouncing
  const handleEmailUpdate = useCallback(
    debounce(async () => {
      if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
        setEmailUpdateStatus({
          loading: false,
          error: 'Please enter a valid email',
          success: false,
        });
        return;
      }

      setEmailUpdateStatus({ loading: true, error: null, success: false });

      try {
        const result = await updateEmail(
          newEmail.trim(),
          currentUser.firstname,
          currentUser.lastname
        );
        if (result.success) {
          setEmailUpdateStatus({ loading: false, error: null, success: true });
          setEditEmail(false);
          setTimeout(() => {
            setEmailUpdateStatus((prev) => ({ ...prev, success: false }));
          }, 3000);
        } else {
          setEmailUpdateStatus({
            loading: false,
            error: result.error || 'Failed to update email',
            success: false,
          });
        }
      } catch (err) {
        setEmailUpdateStatus({
          loading: false,
          error: err.message || 'Failed to update email',
          success: false,
        });
      }
    }, 300),
    [newEmail, currentUser]
  );

  // Handle password update
  const handlePasswordUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setPasswordUpdateStatus({ loading: false, error: "Passwords don't match", success: false });
        return;
      }

      if (newPassword.length < 8) {
        setPasswordUpdateStatus({
          loading: false,
          error: 'Password must be at least 8 characters',
          success: false,
        });
        return;
      }

      setPasswordUpdateStatus({ loading: true, error: null, success: false });

      try {
        const result = await updatePassword(currentPassword, newPassword);
        if (result.success) {
          setPasswordUpdateStatus({ loading: false, error: null, success: true });
          setTimeout(() => {
            setShowPasswordForm(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordUpdateStatus((prev) => ({ ...prev, success: false }));
          }, 3000);
        } else {
          setPasswordUpdateStatus({ loading: false, error: result.error, success: false });
        }
      } catch (err) {
        setPasswordUpdateStatus({ loading: false, error: err.message, success: false });
      }
    },
    [currentPassword, newPassword, confirmPassword]
  );

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="flex items-center text-red-500 mb-4">
            <FiAlertCircle size={24} className="mr-2" />
            <h2 className="text-xl font-bold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            aria-label="Retry loading profile"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          .section:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .form-enter {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
          }
          .form-enter-active {
            max-height: 500px;
            opacity: 1;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="bg-indigo-600 px-6 py-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-semibold">My Account</h1>
          <p className="mt-2 text-indigo-100 text-sm">Manage your personal information</p>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Name Field */}
          <div className="bg-gray-50 p-4 rounded-lg section transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiUser className="text-indigo-600" />
                <span className="font-medium text-gray-700">Full Name</span>
              </div>
              {!editName && (
                <button
                  onClick={() => setEditName(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-sm"
                  aria-label="Edit full name"
                >
                  <FiEdit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>
            {!editName ? (
              <div className="mt-2 ml-8 fade-in">
                <p className="text-gray-800">{getFullName()}</p>
                {nameUpdateStatus.success && (
                  <p className="text-green-600 text-sm mt-1">Name updated successfully!</p>
                )}
              </div>
            ) : (
              <div className="mt-2 ml-8 space-y-2 fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Last name"
                    />
                  </div>
                </div>
                {nameUpdateStatus.error && (
                  <p className="text-red-600 text-sm">{nameUpdateStatus.error}</p>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleNameUpdate}
                    disabled={nameUpdateStatus.loading}
                    className={`bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-1 text-sm transition-colors ${
                      nameUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Save name changes"
                  >
                    {nameUpdateStatus.loading ? (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                    ) : (
                      <FiSave size={16} />
                    )}
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditName(false);
                      setNewFirstName(currentUser?.firstname || '');
                      setNewLastName(currentUser?.lastname || '');
                      setNameUpdateStatus({ loading: false, error: null, success: false });
                    }}
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 text-sm transition-colors"
                    disabled={nameUpdateStatus.loading}
                    aria-label="Cancel name changes"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="bg-gray-50 p-4 rounded-lg section transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiMail className="text-indigo-600" />
                <span className="font-medium text-gray-700">Email Address</span>
              </div>
              {!editEmail && (
                <button
                  onClick={() => setEditEmail(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-sm"
                  aria-label="Edit email address"
                >
                  <FiEdit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>
            {!editEmail ? (
              <div className="mt-2 ml-8 fade-in">
                <p className="text-gray-800">{currentUser?.email}</p>
                {emailUpdateStatus.success && (
                  <p className="text-green-600 text-sm mt-1">Email updated successfully!</p>
                )}
              </div>
            ) : (
              <div className="mt-2 ml-8 space-y-2 fade-in">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Email address"
                />
                {emailUpdateStatus.error && (
                  <p className="text-red-600 text-sm">{emailUpdateStatus.error}</p>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEmailUpdate}
                    disabled={emailUpdateStatus.loading}
                    className={`bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-1 text-sm transition-colors ${
                      emailUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Save email changes"
                  >
                    {emailUpdateStatus.loading ? (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                    ) : (
                      <FiSave size={16} />
                    )}
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditEmail(false);
                      setNewEmail(currentUser?.email || '');
                      setEmailUpdateStatus({ loading: false, error: null, success: false });
                    }}
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 text-sm transition-colors"
                    disabled={emailUpdateStatus.loading}
                    aria-label="Cancel email changes"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-gray-50 p-4 rounded-lg section transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiLock className="text-indigo-600" />
                <span className="font-medium text-gray-700">Password</span>
              </div>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-sm"
                  aria-label="Change password"
                >
                  <FiEdit size={16} />
                  <span>Change</span>
                </button>
              )}
            </div>
            {!showPasswordForm ? (
              <div className="mt-2 ml-8 fade-in">
                <p className="text-gray-800">••••••••</p>
                {passwordUpdateStatus.success && (
                  <p className="text-green-600 text-sm mt-1">Password updated successfully!</p>
                )}
              </div>
            ) : (
              <form
                onSubmit={handlePasswordUpdate}
                className={`mt-2 ml-8 space-y-3 form-enter ${showPasswordForm ? 'form-enter-active' : ''}`}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    aria-label="Current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    aria-label="New password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    aria-label="Confirm new password"
                  />
                </div>
                {passwordUpdateStatus.error && (
                  <p className="text-red-600 text-sm">{passwordUpdateStatus.error}</p>
                )}
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={passwordUpdateStatus.loading}
                    className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-1 text-sm transition-colors ${
                      passwordUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Update password"
                  >
                    {passwordUpdateStatus.loading && (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                    )}
                    <span>Update Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordUpdateStatus({ loading: false, error: null, success: false });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm transition-colors"
                    disabled={passwordUpdateStatus.loading}
                    aria-label="Cancel password changes"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MyAccount);