import React, { createContext, useState, useContext, useEffect } from "react";
import { isAuthenticated } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistItems,
} from "../api/wishlist";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  // Use currentUser to determine authentication status
  const user = isAuthenticated();
  // Fetch wishlist items when user changes
  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        await fetchWishlistItems();
      } else {
        setWishlistItems([]);
      }
    };
    fetchItems();
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await getWishlistItems();
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist items");
    } finally {
      setLoading(false);
    }
  };

  const addItemToWishlist = async (productId) => {
    if (!user) {
      toast.info("Please login to add items to wishlist");
      return false;
    }

    setLoading(true);
    try {
      const response = await addToWishlist(productId);

      if (response.success) {
        await fetchWishlistItems(); // Refresh the list
        toast.success(response.message || "Product added to wishlist");
        return true;
      }
      toast.error(response.message || "Failed to add product to wishlist");
      return false;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(
        error.response?.data?.message || "Failed to add product to wishlist"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromWishlist = async (productId) => {
    if (!user) {
      toast.info("Please login to manage wishlist");
      return false;
    }

    setLoading(true);
    try {
      const response = await removeFromWishlist(productId);

      if (response.success) {
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
        toast.success(response.message || "Product removed from wishlist");
        return true;
      }
      toast.error(response.message || "Failed to remove product from wishlist");
      return false;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from wishlist"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addItemToWishlist,
        removeItemFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
