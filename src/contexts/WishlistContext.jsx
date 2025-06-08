import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getWishlistItems, addToWishlist, removeFromWishlist } from '../api/wishlist';
import { isAuthenticated } from '../api/auth';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // Use useCallback to prevent the function from being recreated on every render
  const fetchWishlistItems = useCallback(async () => {
    const user = isAuthenticated();
    if (!user) {
      setWishlistItems([]);
      setWishlistCount(0);
      return;
    }
    
    setLoading(true);
    try {
      const response = await getWishlistItems();
      if (response.success) {
        setWishlistItems(response.data);
        setWishlistCount(response.data.length);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch wishlist items');
        setWishlistItems([]);
        setWishlistCount(0);
      }
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
      setError('An unexpected error occurred');
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed here
  
  // Fetch wishlist items when the component mounts or when the user logs in/out
  useEffect(() => {
    const user = isAuthenticated();
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [fetchWishlistItems]);
  
  // Add item to wishlist
  const addItemToWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, message: 'Please login to add items to wishlist' };
    }
    
    try {
      const response = await addToWishlist(productId);
      
      if (response.success) {
        // Only fetch the wishlist again if the API call was successful
        await fetchWishlistItems();
      }
      
      return response;
    } catch (err) {
      console.error('Error adding item to wishlist:', err);
      return { 
        success: false, 
        message: 'Failed to add item to wishlist' 
      };
    }
  }, [fetchWishlistItems]);
  
  // Remove item from wishlist
  const removeItemFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, message: 'Please login to manage your wishlist' };
    }
    
    try {
      const response = await removeFromWishlist(productId);
      
      if (response.success) {
        // Only fetch the wishlist again if the API call was successful
        await fetchWishlistItems();
      }
      
      return response;
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      return { 
        success: false, 
        message: 'Failed to remove item from wishlist' 
      };
    }
  }, [fetchWishlistItems]);
  
  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);
  
  // Refresh wishlist data
  const refreshWishlist = useCallback(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);
  
  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    error,
    addItemToWishlist,
    removeItemFromWishlist,
    isInWishlist,
    refreshWishlist
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;