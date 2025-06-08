import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { isAuthenticated } from "../api/auth";
import LoadingSpinner from "../utils/Loader";
import { formatPrice } from "../utils/formatters";
import EmptyState from "../components/ui/EmptyState";
import AddToCartButton from "../components/cart/AddToCartButton";

const WishlistPage = () => {
  const { wishlistItems, loading, removeItemFromWishlist, refreshWishlist } = useWishlist();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  // Check authentication once, not on every render
  const fetchWishlist = useCallback(async () => {
    const user = isAuthenticated();
   
    if (!user) {
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }
    
    try {
      await refreshWishlist();
      setError("");
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist items");
    }
  }, [navigate, refreshWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeItemFromWishlist(productId);
      setError("");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove item from wishlist");
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <EmptyState
          title="Your wishlist is empty"
          description="Items added to your wishlist will appear here."
          actionText="Continue Shopping"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div 
            key={product._id} 
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={`/product/${product.url_key}`}>
              <div className="h-48 overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/product/${product.url_key}`}>
                <h2 className="text-lg font-medium text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                  {product.name}
                </h2>
              </Link>
              
              <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.stock_status == "IN_STOCK" ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <AddToCartButton 
                  product={product} 
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                />
                
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="p-2 text-gray-500 hover:text-red-500 border border-gray-300 rounded-md"
                  aria-label="Remove from wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
