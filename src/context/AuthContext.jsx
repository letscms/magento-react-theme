import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

/**
 * Auth Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Implement actual authentication logic here
      // For now, we'll simulate a successful login
      setUser({ id: '1', email, name: 'User' });
      return true;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      // Implement actual sign out logic here
      setUser(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Implement actual auth check logic here
        // For example, check local storage or a token
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        setError(err.message || 'Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
