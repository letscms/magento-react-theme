import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiEdit, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

function Myaccount() {
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

  // Update form states when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setNewFirstName(currentUser.firstname || '');
      setNewLastName(currentUser.lastname || '');
      setNewEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Get full name from first and last name
  const getFullName = () => {
    if (!currentUser) return '';
    return `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim();
  };

  // Handle name update
  const handleNameUpdate = async () => {
    if (!newFirstName.trim() || !newLastName.trim()) {
      setNameUpdateStatus({ 
        loading: false, 
        error: "First name and last name cannot be empty", 
        success: false 
      });
      return;
    }
    
    setNameUpdateStatus({ loading: true, error: null, success: false });
    
    try {
      const result = await updateName({ 
        firstname: newFirstName.trim(), 
        lastname: newLastName.trim() ,
        email : currentUser.email
      });
      if (result.success) {
        setNameUpdateStatus({ loading: false, error: null, success: true });
        setEditName(false);
        
        // Show success message briefly
        setTimeout(() => {
          setNameUpdateStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      } else {
        setNameUpdateStatus({ 
          loading: false, 
          error: result.error || 'Failed to update name', 
          success: false 
        });
      }
    } catch (err) {
      setNameUpdateStatus({ 
        loading: false, 
        error: err.message || 'Failed to update name', 
        success: false 
      });
    }
  };

  // Handle email update
  const handleEmailUpdate = async () => {
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailUpdateStatus({ 
        loading: false, 
        error: "Please enter a valid email", 
        success: false 
      });
      return;
    }
    
    setEmailUpdateStatus({ loading: true, error: null, success: false });
    
    try {
      const result = await updateEmail(newEmail.trim(),
        currentUser.firstname,
        currentUser.lastname
      );
      
      if (result.success) {
        setEmailUpdateStatus({ loading: false, error: null, success: true });
        setEditEmail(false);
        
        // Show success message briefly
        setTimeout(() => {
          setEmailUpdateStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      } else {
        setEmailUpdateStatus({ 
          loading: false, 
          error: result.error || 'Failed to update email', 
          success: false 
        });
      }
    } catch (err) {
      setEmailUpdateStatus({ 
        loading: false, 
        error: err.message || 'Failed to update email', 
        success: false 
      });
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordUpdateStatus({ loading: false, error: "Passwords don't match", success: false });
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordUpdateStatus({ loading: false, error: "Password must be at least 8 characters", success: false });
      return;
    }
    
    setPasswordUpdateStatus({ loading: true, error: null, success: false });
    
    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordUpdateStatus({ loading: false, error: null, success: true });
        
        // Reset form and close it after success
        setTimeout(() => {
          setShowPasswordForm(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordUpdateStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      } else {
        setPasswordUpdateStatus({ loading: false, error: result.error, success: false });
      }
    } catch (err) {
      setPasswordUpdateStatus({ loading: false, error: err.message, success: false });
    }
  };

  // Show loading state
  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
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
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="mt-2 text-blue-100">Manage your personal information and account settings</p>
        </div>

        {/* User Profile Section */}
        <div className="p-6">
          

          {/* User Information Section */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiUser className="text-blue-500" />
                  <span className="font-medium text-gray-700">Full Name</span>
                </div>
                {!editName ? (
                  <button 
                    onClick={() => setEditName(true)}
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <FiEdit size={16} />
                    <span>Edit</span>
                  </button>
                ) : null}
              </div>
              
              {!editName ? (
                <div className="mt-2 ml-8">
                  <p className="text-gray-800">{getFullName()}</p>
                  {nameUpdateStatus.success && (
                    <p className="text-green-500 text-sm mt-1">Name updated successfully!</p>
                  )}
                </div>
              ) : (
                <div className="mt-2 ml-8 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {nameUpdateStatus.error && (
                    <p className="text-red-500 text-sm">{nameUpdateStatus.error}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleNameUpdate}
                      disabled={nameUpdateStatus.loading}
                      className={`bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 ${
                        nameUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
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
                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400"
                      disabled={nameUpdateStatus.loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiMail className="text-blue-500" />
                  <span className="font-medium text-gray-700">Email Address</span>
                </div>
                {!editEmail ? (
                  <button 
                    onClick={() => setEditEmail(true)}
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <FiEdit size={16} />
                    <span>Edit</span>
                  </button>
                ) : null}
              </div>
              
              {!editEmail ? (
                <div className="mt-2 ml-8">
                  <p className="text-gray-800">{currentUser?.email}</p>
                  {emailUpdateStatus.success && (
                    <p className="text-green-500 text-sm mt-1">Email updated successfully!</p>
                  )}
                </div>
              ) : (
                <div className="mt-2 ml-8 space-y-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {emailUpdateStatus.error && (
                    <p className="text-red-500 text-sm">{emailUpdateStatus.error}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleEmailUpdate}
                      disabled={emailUpdateStatus.loading}
                      className={`bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 ${
                        emailUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
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
                        setNewEmail(currentUser?.email);
                        setEmailUpdateStatus({ loading: false, error: null, success: false });
                      }}
                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400"
                      disabled={emailUpdateStatus.loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiLock className="text-blue-500" />
                  <span className="font-medium text-gray-700">Password</span>
                </div>
                {!showPasswordForm ? (
                  <button 
                    onClick={() => setShowPasswordForm(true)}
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <FiEdit size={16} />
                    <span>Change</span>
                  </button>
                ) : null}
              </div>
              
              {!showPasswordForm ? (
                <div className="mt-2 ml-8">
                  <p className="text-gray-800">••••••••</p>
                  {passwordUpdateStatus.success && (
                    <p className="text-green-500 text-sm mt-1">Password updated successfully!</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="mt-2 ml-8 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {passwordUpdateStatus.error && (
                    <p className="text-red-500 text-sm">{passwordUpdateStatus.error}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <button 
                      type="submit"
                      disabled={passwordUpdateStatus.loading}
                      className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-1 ${
                        passwordUpdateStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {passwordUpdateStatus.loading ? (
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                      ) : null}
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
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                      disabled={passwordUpdateStatus.loading}
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
    </div>
  );
}

export default React.memo(Myaccount);
