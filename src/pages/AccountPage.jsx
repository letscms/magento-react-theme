import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentCustomer, logout, isAuthenticated } from '../api/auth';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentCustomer();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load account information. Please try again.');
        
        // If token is invalid, redirect to login
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: location.pathname } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);

  // Navigation items for the sidebar
  const navigationItems = [
    { name: 'Dashboard', path: '/account', icon: 'fas fa-tachometer-alt' },
    { name: 'My Orders', path: '/account/orders', icon: 'fas fa-shopping-bag' },
    { name: 'My Addresses', path: '/account/addresses', icon: 'fas fa-map-marker-alt' },
    { name: 'Account Information', path: '/account/edit', icon: 'fas fa-user-edit' },
    { name: 'My Reviews', path: '/account/reviews', icon: 'fas fa-star' },  
    
  ];

  // Check if the current path matches a navigation item
  const isActive = (path) => {
    if (path === '/account' && location.pathname === '/account') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/account';
  };

  const handleLogout = async () => {
    try {
      await logout();
       window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 shadow-md rounded bg-white">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 rounded-full p-3">
                  <i className="fas fa-user text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user?.firstname} {user?.lastname}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="flex flex-col">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-6 py-3 hover:bg-gray-50 ${
                      isActive(item.path) ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    <i className={`${item.icon} w-5 mr-3 ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'}`}></i>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 mt-2"
                >
                  <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* This is where nested routes will render */}
              <Outlet context={{ user }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
