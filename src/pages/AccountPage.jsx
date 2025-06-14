import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentCustomer, logout, isAuthenticated } from '../api/auth';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added for mobile sidebar toggle
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchUserData = async () => {
      try {
        const userData = await getCurrentCustomer();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load account information. Please try again.');
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: location.pathname } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);

  const navigationItems = [
    { name: 'Dashboard', path: '/account', icon: 'fas fa-tachometer-alt' },
    { name: 'My Orders', path: '/account/orders', icon: 'fas fa-shopping-bag' },
    { name: 'My Addresses', path: '/account/addresses', icon: 'fas fa-map-marker-alt' },
    { name: 'Account Information', path: '/account/edit', icon: 'fas fa-user-edit' },
    { name: 'My Reviews', path: '/account/reviews', icon: 'fas fa-star' },
  ];

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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 sm:mt-10 p-4 sm:p-6 shadow-md rounded-lg bg-white">
        <div className="text-red-600 mb-4 text-sm sm:text-base">{error}</div>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg sm:text-xl font-bold">My Account</h2>
          <button
            onClick={toggleSidebar}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <aside className={`w-full md:w-1/4 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-indigo-100 rounded-full p-2 sm:p-3">
                  <i className="fas fa-user text-indigo-600 text-lg sm:text-xl"></i>
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg">{user?.firstname} {user?.lastname}</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">{user?.email}</p>
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
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                    className={`flex items-center px-4 sm:px-6 py-3 hover:bg-gray-50 ${
                      isActive(item.path) ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    <i className={`${item.icon} w-5 mr-2 sm:mr-3 ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'}`}></i>
                    <span className="text-sm sm:text-base">{item.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 sm:px-6 py-3 text-red-600 hover:bg-red-50 mt-2 text-sm sm:text-base"
                >
                  <i className="fas fa-sign-out-alt w-5 mr-2 sm:mr-3"></i>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <Outlet context={{ user }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;