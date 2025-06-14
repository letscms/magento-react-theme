import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../api/auth.jsx";
import Swal from "sweetalert2";
// Import GraphQL cart functions
import {
  createCart as apiCreateCart,
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  // getGlobalCartData, // Potentially useful later
} from "../api/cart.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { createRoot } from "react-dom/client";
import {
  CART_KEY,
  CART_SESSION_KEY,
  GUEST_CART_ID_KEY,
} from "../constants/storageKeys";

// Add item to cart

import Loginforms from "../components/forms/Loginforms.jsx";

// Create context
const CartContext = createContext(null);
// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [guestCartId, setGuestCartId] = useState(
    localStorage.getItem(GUEST_CART_ID_KEY)
  );

  // Format cart items from GraphQL cart structure
  const formatCartItems = (gqlCartData) => {
    if (!gqlCartData || !Array.isArray(gqlCartData.items)) {
      return [];
    }
    return gqlCartData.items.map((item) => {
      const product = item.product || {};
      const prices = item.prices || {};
      const itemPrice = prices.price || {};
      // Prefer row_total for the displayed price per item if available, else item price
      const displayPrice =
        prices.row_total?.value / item.quantity || itemPrice.value || 0;

      return {
        id: item.id, // GraphQL cart item ID
        sku: product.sku,
        name: product.name,
        price: displayPrice, // Price per unit
        qty: item.quantity,
        // Ensure image path is complete if baseMediaUrl is needed, or if URL is absolute
        image:
          product.small_image?.url || product.image?.url || "/placeholder.jpg",
        item_id: item.id, // Keep for compatibility if used elsewhere, but 'id' is primary
        product_id: product.id, // Product entity ID
        // Add other relevant fields from GraphQL if needed
        // e.g., configurable_options: item.configurable_options
      };
    });
  };

  // Fetch cart data
  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    let currentCartId = guestCartId; // Use state for guestCartId

    try {
      const isLoggedIn = authService.isAuthenticated();
      let cartDataResponse;

      if (isLoggedIn) {
        cartDataResponse = await apiGetCart(); // For logged-in user
      } else {
        if (!currentCartId) {
          currentCartId = await apiCreateCart(); // Create guest cart
          if (currentCartId) {
            localStorage.setItem(GUEST_CART_ID_KEY, currentCartId);
            setGuestCartId(currentCartId); // Update state
          } else {
            throw new Error("Failed to create guest cart ID.");
          }
        }
        if (currentCartId) {
          cartDataResponse = await apiGetCart(currentCartId); // For guest user
        } else {
          // Should not happen if createCart was successful
          console.error(
            "Guest cart ID is still null after attempting creation."
          );
          setCartItems([]);
          setCart({ items: [] });
          setLoading(false);
          return;
        }
      }

      if (cartDataResponse) {
        const formattedItems = formatCartItems(cartDataResponse);
        setCart(cartDataResponse); // Store the raw GraphQL cart response
        setCartItems(formattedItems);
        // Save formatted items to localStorage/sessionStorage for UI consistency or offline fallback
        // For logged-in users, CART_SESSION_KEY might be used for quick UI updates
        localStorage.setItem(CART_SESSION_KEY, JSON.stringify(formattedItems));
      } else {
        // Handle cases where cartDataResponse might be undefined (e.g., empty cart for new guest)
        setCartItems([]);
        setCart({ items: [] });
        if (!isLoggedIn && !currentCartId) {
          // If it's a guest and no cart ID could be established, initialize empty.
          localStorage.removeItem(GUEST_CART_ID_KEY); // Ensure no stale ID
        }
      }
    } catch (err) {
      console.error("❌ Error fetching/creating cart with GraphQL:", err);
      setError(`Failed to load cart data: ${err.message}. Please try again.`);
      // Fallback to localStorage if API fails (for UI persistence)
      const localCartItems = localStorage.getItem(CART_SESSION_KEY);
      if (localCartItems) {
        try {
          const parsedItems = JSON.parse(localCartItems);
          setCartItems(parsedItems);
          setCart({ items: parsedItems }); // Simulate cart structure
        } catch (parseError) {
          console.error("Error parsing local cart items:", parseError);
          setCartItems([]);
          setCart({ items: [] });
        }
      } else {
        setCartItems([]);
        setCart({ items: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const addItemToCart = async (productDetails) => {
    setUpdating(true);
    setError(null);
    const isLoggedIn = authService.isAuthenticated();
    console.log("Adding item to cart:", productDetails);

    try {
      if (!isLoggedIn) {
        throw new Error("Please log in to add items to the cart");
      }

      let cartItems = [];

      // Check if it's a bundle product
      const isBundleProduct =
        productDetails.__typename === "BundleProduct" &&
        productDetails.product_option?.extension_attributes?.bundle_options
          ?.length > 0;

      // Check if it's a grouped product
      const isGroupedProduct =
        productDetails.extension_attributes?.grouped_items?.length > 0;

      if (isBundleProduct) {
        // Validate and process bundle options
        const bundleOptions =
          productDetails.product_option.extension_attributes.bundle_options;

        if (!Array.isArray(bundleOptions) || bundleOptions.length === 0) {
          throw new Error("No valid bundle options provided");
        }

        const bundleOptionsFormatted = bundleOptions.map((option) => {
          if (
            !option.option_selections ||
            !Array.isArray(option.option_selections) ||
            option.option_selections.length === 0
          ) {
            throw new Error(
              `Please select at least one value for option ID ${option.option_id}`
            );
          }

          return {
            id: parseInt(option.option_id, 10),
            quantity: parseInt(option.option_qty, 10),
            value: option.option_selections.map((selectionId) =>
              selectionId.toString()
            ),
          };
        });

        console.log("✅ bundleOptionsFormatted", bundleOptionsFormatted);

        if (bundleOptionsFormatted.length === 0) {
          throw new Error(
            "Please select quantities for at least one bundle product item"
          );
        }

        // Final formattedCartItems
        const formattedCartItems = [
          {
            data: {
              sku: productDetails.sku,
              quantity: productDetails.qty || 1,
            },
            bundle_options: bundleOptionsFormatted,
          },
        ];
        cartItems = formattedCartItems;

        console.log("✅ Final formattedCartItems: use cart", cartItems);
      } else if (isGroupedProduct) {
        // Validate and process grouped items
        const groupedItems = productDetails.extension_attributes.grouped_items;
        if (!Array.isArray(groupedItems) || groupedItems.length === 0) {
          throw new Error("No valid grouped items provided");
        }

        cartItems = groupedItems
          .filter((item) => item.sku && item.qty > 0)
          .map((item) => ({
            sku: item.sku,
            quantity: parseInt(item.qty, 10),
          }));

        if (cartItems.length === 0) {
          throw new Error(
            "Please select quantities for at least one grouped product item"
          );
        }
      } else {
        // Handle simple products
        if (!productDetails.qty || productDetails.qty <= 0) {
          console.warn(
            "No quantity specified for simple product, skipping add to cart."
          );
          return { success: false, message: "Quantity must be greater than 0" };
        }

        cartItems = [
          {
            sku: productDetails.sku,
            quantity: parseInt(productDetails.qty, 10),
          },
        ];
      }

      console.log("Adding to apiCart:", cartItems);

      // Call addToCart with the processed cart items
      const result = await apiAddToCart(cartItems);

      await fetchCartData(); // Refresh cart from backend

      return { success: true, cart: result };
    } catch (err) {
      console.error("❌ Error adding item to cart with GraphQL:", err);
      setError(`Failed to add item to cart: ${err.message}. Please try again.`);
      throw err;
    } finally {
      setUpdating(false);
    }
  };
  // Remove item from cart
  const removeItem = async (cartItemId) => {
    // Expects the GraphQL cart item ID
    setUpdating(true);
    setError(null);
    const isLoggedIn = authService.isAuthenticated();

    try {
      // Find the item in the local cartItems to ensure it exists before trying to remove
      // The cartItemId here should be the one from the formatted cart items (item.id from GraphQL)
      const itemToRemove = cartItems.find((item) => item.id === cartItemId);

      if (!itemToRemove) {
        // If not found in local state, perhaps log or handle, but API might still succeed if ID is valid
        console.warn(
          `Item with ID ${cartItemId} not found in local cart state, attempting removal anyway.`
        );
      }

      // Use GraphQL API to remove item
      // apiRemoveFromCart expects (itemId, cartId)
      // itemId is the GraphQL cart_item_id
      const cartIdForApi = isLoggedIn ? (cart ? cart.id : null) : guestCartId;
      if (!cartIdForApi) {
        // Log a warning if no cart ID could be determined before calling the API.
        // The apiRemoveFromCart function has its own fallback for this scenario.
        console.warn(
          `No cart ID determined for apiRemoveFromCart (isLoggedIn: ${isLoggedIn}). Fallback logic in apiRemoveFromCart will be invoked.`
        );
      }
      await apiRemoveFromCart(cartItemId, cartIdForApi);

      await fetchCartData(); // Refresh cart from backend

      return { success: true };
    } catch (err) {
      console.error("❌ Error removing item from cart with GraphQL:", err);
      setError(`Failed to remove item: ${err.message}. Please try again.`);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (cartItemId, qty) => {
    // Expects GraphQL cart item ID and new quantity
    setUpdating(true);
    setError(null);
    const isLoggedIn = authService.isAuthenticated();

    try {
      if (qty <= 0) {
        // If quantity is 0 or less, remove the item instead
        return removeItem(cartItemId);
      }

      // Find the item in the local cartItems to ensure it exists before trying to update
      const itemToUpdate = cartItems.find((item) => item.id === cartItemId);

      if (!itemToUpdate) {
        // If not found in local state, perhaps log or handle
        console.warn(
          `Item with ID ${cartItemId} not found in local cart state for update, attempting API call anyway.`
        );
      }

      // Use GraphQL API to update item quantity
      // apiUpdateCartItem expects (itemId, quantity, cartId)
      // itemId is the GraphQL cart_item_id
      await apiUpdateCartItem(cartItemId, qty, isLoggedIn ? null : guestCartId);

      await fetchCartData(); // Refresh cart from backend

      return { success: true };
    } catch (err) {
      console.error("❌ Error updating item quantity with GraphQL:", err);
      setError(`Failed to update quantity: ${err.message}. Please try again.`);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0);
  };

  // Check if a product is in the cart
  const isInCart = (sku) => {
    return cartItems.find((item) => item.sku === sku) || null;
  };

  // Clear cart (primarily local, consider if backend clear is needed)
  const clearCart = async () => {
    setUpdating(true);
    setError(null);
    try {
      // For a logged-in user, we might want to call a mutation to clear their server-side cart.
      // For a guest, clearing local/session storage and guestCartId might be enough.
      // If there's a `clearCustomerCart` or similar mutation, it would be called here.
      // For now, this focuses on local state and storage.

      setCartItems([]);
      setCart(null); // Set cart to null or an empty cart structure
      localStorage.removeItem(CART_SESSION_KEY); // Clear persisted cart items

      if (!authService.isAuthenticated()) {
        localStorage.removeItem(GUEST_CART_ID_KEY); // Clear guest cart ID
        setGuestCartId(null); // Reset guest cart ID in state
      }

      // Optionally, call fetchCartData to ensure consistency if an empty cart is fetched from backend
      // await fetchCartData();
      return { success: true };
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
      throw err; // Re-throw to allow UI to handle
    } finally {
      setUpdating(false);
    }
  };

  // Merge guest cart with user cart after login
  const mergeWithUserCart = async () => {
    setUpdating(true);
    setError(null);
    try {
      // Retrieve guest cart items from localStorage (where fetchCartData now saves them)
      const guestCartItemsString = localStorage.getItem(CART_SESSION_KEY);
      const localGuestCartId = localStorage.getItem(GUEST_CART_ID_KEY);

      if (guestCartItemsString && authService.isAuthenticated()) {
        let guestItems = [];
        try {
          guestItems = JSON.parse(guestCartItemsString);
        } catch (parseError) {
          console.error(
            "Error parsing guest cart items for merge:",
            parseError
          );
          // Potentially clear the corrupted data
          localStorage.removeItem(CART_SESSION_KEY);
          localStorage.removeItem(GUEST_CART_ID_KEY);
          setGuestCartId(null);
          await fetchCartData(); // Attempt to fetch fresh cart for logged-in user
          return {
            success: false,
            message: "Failed to parse guest cart for merge.",
          };
        }

        if (Array.isArray(guestItems) && guestItems.length > 0) {
          for (const item of guestItems) {
            // Ensure item has sku and qty for addItemToCart
            if (item.sku && item.qty) {
              try {
                // addItemToCart now handles logged-in state internally
                await addItemToCart({ sku: item.sku, qty: item.qty });
              } catch (addError) {
                console.error(
                  `❌ Error adding guest item SKU ${item.sku} to customer cart:`,
                  addError.message
                );
                // Decide if you want to stop merging or continue with other items
              }
            } else {
              console.warn(
                "Skipping guest item due to missing SKU or Qty:",
                item
              );
            }
          }
        }

        // Clear guest cart data from localStorage and state after attempting merge
        localStorage.removeItem(CART_SESSION_KEY);
        localStorage.removeItem(GUEST_CART_ID_KEY);
        setGuestCartId(null); // Reset guest cart ID in state
      }

      // Always fetch fresh cart data for the logged-in user after merge attempt
      await fetchCartData();

      return { success: true };
    } catch (err) {
      console.error("❌ Error merging carts:", err);
      setError(`Failed to merge carts: ${err.message}. Please try again.`);
      // Fetch cart data even on error to ensure UI reflects current server state
      await fetchCartData().catch((fetchErr) =>
        console.error("Error fetching cart after merge failure:", fetchErr)
      );
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    fetchCartData();

    // Set up an interval to refresh the cart periodically (every 5 minutes)
    const refreshInterval = setInterval(() => {
      if (authService.isAuthenticated()) {
        fetchCartData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(refreshInterval);
  }, []);

  // Value to be provided by the context
  const value = {
    cart,
    cartItems,
    loading,
    updating,
    error,
    fetchCartData,
    addItemToCart,
    removeItem,
    updateItemQuantity,
    calculateSubtotal,
    getCartItemCount,
    isInCart,
    clearCart,
    mergeWithUserCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
