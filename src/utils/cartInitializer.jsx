import { useEffect } from 'react';
import { getCart } from '../api/cart';
import authService from '../api/auth.jsx';

/**
 * Component that initializes the cart when the application loads
 * This should be included near the top of your application component tree
 */
const CartInitializer = () => {
  useEffect(() => {
    const initializeCart = async () => {
      try {
        
        // For guest users, get cart ID from localStorage
        const guestCartId = localStorage.getItem('magento_guest_cart_id');
        
        if (authService.isAuthenticated()) {
            await getCart();
        } else if (guestCartId) {
          await getCart(guestCartId);
        } 
      } catch (error) {
        console.error("❌ Error initializing cart:", error);
      }
    };
    
    initializeCart();
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default CartInitializer;