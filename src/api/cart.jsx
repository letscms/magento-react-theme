import { GraphQLApi } from "./auth";

// Global cart data storage
let globalCartData = null;

/**
 * Creates a new cart based on user authentication status
 * @returns {Promise<string>} Cart ID
 */
export const createCart = async () => {
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;

    const createCartMutation = `
      mutation {
        createEmptyCart
      }
    `;

    const response = await api.post("", {
      query: createCartMutation,
    });

    const cartId = response.data.data.createEmptyCart;

    // Store the cart ID for guest users in sessionStorage
    if (!isLoggedIn) {
      sessionStorage.setItem("guest_cart_id", cartId);
    }

    return cartId;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Failed to create cart");
  }
};

/**
 * Create an active cart for logged-in customers
 * @returns {Promise<string>} Cart ID
 */
export const createActiveCart = async () => {
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");

    if (!isLoggedIn) {
      throw new Error("This function is only for logged-in customers");
    }

    const api = GraphQLApi;

    const createCartMutation = `
      mutation {
        createEmptyCart
      }
    `;

    const response = await api.post("", {
      query: createCartMutation,
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const cartId = response.data.data.createEmptyCart;
    localStorage.setItem("customer_cart_id", cartId);
    return cartId;
  } catch (error) {
    console.error(
      "❌ Error creating active cart:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create active cart");
  }
};

/**
 * Gets the current cart ID, creating one if it doesn't exist
 * @returns {Promise<string>} Cart ID
 */
const getOrCreateCartId = async () => {
  const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");

  if (isLoggedIn) {
    const cartId = localStorage.getItem("customer_cart_id");
    if (cartId) return cartId;
    return await createActiveCart();
  } else {
    const cartId = sessionStorage.getItem("guest_cart_id");
    if (cartId) return cartId;
    return await createCart();
  }
};

/**
 * Gets the current cart contents
 * @param {string} cartId - Optional cart ID for guest users
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async (cartId = null) => {
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;
    let response;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }
    if (isLoggedIn) {
      const customerCartQuery = `
        query {
          customerCart {
            id
            items {
              id
              product {
                id
                name
                sku
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
                small_image {
                  url
                }
              }
              quantity
              prices {
                price {
                  value
                  currency
                }
                row_total {
                  value
                  currency
                }
              }
            }
            prices {
              grand_total {
                value
                currency
              }
              subtotal_including_tax {
                value
                currency
              }
             
            }
          }
        }
      `;

      try {
        response = await api.post("", {
          query: customerCartQuery,
        });
        globalCartData = response.data.data.customerCart;
      } catch (error) {
        if (
          error.response?.data?.errors?.some((e) =>
            e.message.includes("Current customer does not have an active cart")
          )
        ) {
          // Create a new active cart for the customer
          await createActiveCart();

          // Try fetching the cart again
          response = await api.post("", {
            query: customerCartQuery,
          });

          globalCartData = response.data.data.customerCart;
        } else {
          throw error;
        }
      }
    } else {
      const guestCartQuery = `
        query($cartId: String!) {
          cart(cart_id: $cartId) {
            id
            items {
              id
              product {
                id
                name
                sku
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
                image {
                  url
                }
              }
              quantity
              prices {
                price {
                  value
                  currency
                }
                row_total {
                  value
                  currency
                }
              }
            }
            prices {
              grand_total {
                value
                currency
              }
              subtotal_including_tax {
                value
                currency
              }
              
            }
          }
        }
      `;

      response = await api.post("", {
        query: guestCartQuery,
        variables: { cartId },
      });
      globalCartData = response.data.data.cart;
    }

    // Save to storage for persistence
    if (isLoggedIn) {
      localStorage.setItem(
        "customer_cart_data",
        JSON.stringify(globalCartData)
      );
      localStorage.setItem("customer_cart_id", globalCartData.id);
    } else {
      sessionStorage.setItem("guest_cart_data", JSON.stringify(globalCartData));
      sessionStorage.setItem("guest_cart_id", globalCartData.id);
    }

    return globalCartData;
  } catch (error) {
    console.error(
      "❌ Error fetching cart:",
      error.response?.data || error.message
    );

    // Try to load from storage if API fails
    if (!!localStorage.getItem("magentoCustomerToken")) {
      const storedCart = localStorage.getItem("customer_cart_data");
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    } else {
      const storedGuestCart = sessionStorage.getItem("guest_cart_data");
      if (storedGuestCart) {
        return JSON.parse(storedGuestCart);
      }
    }

    throw new Error("Failed to fetch cart");
  }
};

/**
 * Get the globally stored cart data without making an API call
 * @returns {Object|null} - The globally stored cart data or null if not available
 */
export const getGlobalCartData = () => {
  return globalCartData;
};

/**
 * Adds an item to the cart
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 * @param {string} cartId - Optional cart ID for guest users
 * @returns {Promise<Object>} Updated cart data
 */
/**
 * Adds an item to the cart
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 * @param {string} cartId - Optional cart ID for guest users
 * @returns {Promise<Object>} Updated cart data
 */
export const addToCart = async (cartItems, cartId = null) => {
  const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
  const api = GraphQLApi;
  console.log("Adding to apiCart:", cartItems);

  if (!cartId) {
    cartId = await getOrCreateCartId();
  }

  try {
    await getCart(cartId);
  } catch (error) {
    console.warn("Cart not found, creating new cart");
    cartId = await createCart();
  }

  const isBundleProduct = cartItems.some((item) => item.bundle_options);

  const addToCartMutation = isBundleProduct
    ? `
    mutation($cartId: String!, $cartItems: [BundleProductCartItemInput!]!) {
      addBundleProductsToCart(
        input: {
          cart_id: $cartId
          cart_items: $cartItems
        }
      ) {
        cart {
          id
          items {
            id
            product {
              name
              sku
              image {
                url
              }
            }
            quantity
          }
        }
      }
    }
  `
    : `
    mutation($cartId: String!, $cartItems: [CartItemInput!]!) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
        cart {
          id
          items {
            id
            product {
              name
              sku
              image {
                url
              }
            }
            quantity
          }
        }
        user_errors {
          code
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    cartItems,
  };

  const response = await api.post("", {
    query: addToCartMutation,
    variables,
  });

  if (response.data.errors) {
    const errorMessage = response.data.errors[0].message;
    throw new Error(errorMessage);
  }

  // pick the correct root key based on mutation used
  const addToCartResponseKey = isBundleProduct
    ? "addBundleProductsToCart"
    : "addProductsToCart";

  if (!isBundleProduct) {
    const userErrors = response.data.data[addToCartResponseKey].user_errors;
    if (userErrors?.length > 0) {
      const errorMessage = userErrors[0].message;
      throw new Error(errorMessage);
    }
  }

  await getCart(cartId);

  return response.data.data[addToCartResponseKey].cart;
};



/**
 * Updates the quantity of an item in the cart
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @param {string} cartId - Optional cart ID for guest users
 * @returns {Promise<Object>} Updated cart item
 */
export const updateCartItem = async (itemId, quantity, cartId = null) => {
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }

    const updateCartItemMutation = isLoggedIn
      ? `
      mutation($itemId: Int!, $quantity: Float!) {
        updateCartItems(
          input: {
            cart_items: [
              {
                cart_item_id: $itemId
                quantity: $quantity
              }
            ]
          }
        ) {
          cart {
            items {
              id
              quantity
            }
          }
        }
      }
    `
      : `
      mutation($cartId: String!, $itemId: Int!, $quantity: Float!) {
        updateCartItems(
          input: {
            cart_id: $cartId
            cart_items: [
              {
                cart_item_id: $itemId
                quantity: $quantity
              }
            ]
          }
        ) {
          cart {
            items {
              id
              quantity
            }
          }
        }
      }
    `;

    const variables = isLoggedIn
      ? { itemId: parseInt(itemId), quantity: quantity }
      : { cartId, itemId: parseInt(itemId), quantity: quantity };

    const response = await api.post("", {
      query: updateCartItemMutation,
      variables,
    });

    // Refresh cart data after updating item
    await getCart(cartId);

    return response.data.data.updateCartItems.cart;
  } catch (error) {
    console.error("❌ Error updating cart item:", error);
    throw new Error("Failed to update item quantity");
  }
};

/**
 * Removes an item from the cart
 * @param {string} itemId - Cart item ID
 * @param {string} cartId - Optional cart ID for guest users
 * @returns {Promise<boolean>} Success status
 */
export const removeFromCart = async (itemId, cartId = null) => {
  if (!itemId) {
    throw new Error("Item ID is required to remove an item from the cart");
  }
  if (isNaN(parseInt(itemId))) {
    throw new Error("Invalid item ID format");
  }
  if (parseInt(itemId) <= 0) {
    throw new Error("Item ID must be a positive integer");
  }

  if (!cartId) {
    console.log("No cart ID provided, will create or get existing cart");
  }
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }

    // The mutation now consistently requires cartId and itemId for both logged-in and guest users.
    // The distinction for logged-in vs guest is typically handled by Magento based on the customer token in the header.
    const removeFromCartMutation = `
      mutation($cartId: String!, $itemId: Int!) {
        removeItemFromCart(
          input: {
            cart_id: $cartId
            cart_item_id: $itemId
          }
        ) {
          cart {
            id # It's good practice to fetch the cart ID back
            items {
              id
            }
            # Consider fetching other relevant cart details if needed after removal
          }
        }
      }
    `;

    // Variables will now always include cartId and itemId.
    // The cartId is ensured to be present by the getOrCreateCartId call earlier.
    const variables = { cartId, itemId: parseInt(itemId) };

    await api.post("", {
      query: removeFromCartMutation,
      variables,
    });

    // Refresh cart data after removing item
    await getCart(cartId);

    return true;
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
};

/**
 * Gets current customer information
 * @returns {Promise<Object>} Customer data
 */
export const getCustomerInfo = async () => {
  try {
    const api = GraphQLApi;
    const customerQuery = `
      query {
        customer {
          firstname
          lastname
          email
          addresses {
            id
            firstname
            lastname
            street
            city
            region {
              region_code
              region
            }
            postcode
            country_code
            telephone
            default_shipping
            default_billing
          }
        }
      }
    `;

    const response = await api.post("", {
      query: customerQuery,
    });

    return response.data.data.customer;
  } catch (error) {
    console.error("Error fetching customer info:", error);
    throw new Error("Failed to fetch customer information");
  }
};

/**
 * Merges guest cart with customer cart after login
 * @param {string} guestCartId - Guest cart ID to merge
 * @returns {Promise<string>} New cart ID
 */
export const mergeGuestCart = async (guestCartId) => {
  try {
    const api = GraphQLApi;
    const mergeCarts = `
      mutation($guestCartId: String!) {
        mergeCarts(
          source_cart_id: $guestCartId
          destination_cart_id: null
        ) {
          id
          items {
            id
            product {
              name
            }
            quantity
          }
        }
      }
    `;

    const response = await api.post("", {
      query: mergeCarts,
      variables: {
        guestCartId: guestCartId,
      },
    });

    // Refresh cart data after merging
    await getCart();

    return response.data.data.mergeCarts.id;
  } catch (error) {
    console.error("❌ Error merging carts:", error);
    throw new Error("Failed to merge guest cart with customer cart");
  }
};

/**
 * Apply coupon to cart
 * @param {string} couponCode - Coupon code
 * @param {string|null} cartId - Optional cart ID for guest users
 * @returns {Promise<boolean>} - Success status
 */
export const applyCoupon = async (couponCode, cartId = null) => {
  try {
    if (!couponCode) {
      throw new Error("Coupon code is required");
    }

    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }
    if (!cartId) {
      throw new Error("Cart ID is required to apply a coupon");
    }

    // Enhanced mutation to fetch more details after coupon application
    const applyCouponMutation = `
      mutation ApplyCoupon($cartId: String!, $couponCode: String!) {
        applyCouponToCart(input: { cart_id: $cartId, coupon_code: $couponCode }) {
          cart {
            applied_coupons {
              code
            }
            prices {
              grand_total {
                value
                currency
              }
              subtotal_with_discount_excluding_tax {
                value
                currency
              }
              discounts {
                amount {
                  value
                  currency
                }
                label
              }
              applied_taxes {
                amount {
                  value
                  currency
                }
                label
              }
            }
            items {
              id
              quantity
              prices {
                price {
                  value
                  currency
                }
                row_total {
                  value
                  currency
                }
                total_item_discount {
                  value
                  currency
                }
              }
            }
          }
        }
      }
    `;

    const response = await api.post("", {
      query: applyCouponMutation,
      variables: { cartId, couponCode },
    });

    if (response.data.errors?.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    const updatedCart = response.data.data.applyCouponToCart.cart;

    // Update global cart data
    globalCartData = {
      ...globalCartData,
      ...updatedCart,
    };

    // Update storage based on user status
    if (isLoggedIn) {
      localStorage.setItem(
        "customer_cart_data",
        JSON.stringify(globalCartData)
      );
    } else {
      sessionStorage.setItem("guest_cart_data", JSON.stringify(globalCartData));
    }

    return {
      success: true,
      cart: updatedCart,
      message: `Coupon "${couponCode}" applied successfully`,
    };
  } catch (error) {
    console.error("Error applying coupon:", error);

    return {
      success: false,
      message: error.message || "Failed to apply coupon",
      error: error,
    };
  }
};

/**
 * Remove coupon from cart
 * @param {string|null} cartId - Optional cart ID for guest users
 * @returns {Promise<boolean>} - Success status
 */
export const removeCoupon = async (cartId = null) => {
  try {
    const api = GraphQLApi;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }

    // GraphQL mutation — always send cart_id
    const removeCouponMutation = `
      mutation($cartId: String!) {
        removeCouponFromCart(input: { cart_id: $cartId }) {
          cart {
            applied_coupons {
              code
            }
          }
        }
      }
    `;

    const variables = { cartId };

    const response = await api.post("", {
      query: removeCouponMutation,
      variables,
    });

    const updatedCart = response.data.data.removeCouponFromCart.cart;
    globalCartData = {
      ...globalCartData,
      ...updatedCart,
    };
    // Update storage based on user status
    if (localStorage.getItem("magentoCustomerToken")) {
      localStorage.setItem(
        "customer_cart_data",
        JSON.stringify(globalCartData)
      );
    } else {
      sessionStorage.setItem("guest_cart_data", JSON.stringify(globalCartData));
    }

    // Refresh cart data after removing coupon
    await getCart(cartId);

    return {
      success: true,
      cart: updatedCart,
      message: "Coupon removed successfully",
    };
  } catch (error) {
    console.error(
      "❌ Error removing coupon:",
      error.response?.data || error.message
    );
    throw new Error("Failed to remove coupon");
  }
};


/**
 * Get cart totals
 * @param {string|null} cartId - Optional cart ID for guest users
 * @returns {Promise<Object>} - Cart totals
 */
export const getCartTotals = async (cartId = null) => {
  try {
    const isLoggedIn = !!localStorage.getItem("magentoCustomerToken");
    const api = GraphQLApi;

    // Get or create cart ID if not provided
    if (!cartId) {
      cartId = await getOrCreateCartId();
    }

    const cartTotalsQuery = isLoggedIn
      ? `
      query {
        customerCart {
          prices {
            grand_total {
              value
              currency
            }
            subtotal_including_tax {
              value
              currency
            }
            subtotal_excluding_tax {
              value
              currency
            }
            discounts {
              amount {
                value
                currency
              }
              label
            }
            applied_taxes {
              amount {
                value
                currency
              }
              label
            }
          }
        }
      }
    `
      : `
      query($cartId: String!) {
        cart(cart_id: $cartId) {
          prices {
            grand_total {
              value
              currency
            }
            subtotal_including_tax {
              value
              currency
            }
            subtotal_excluding_tax {
              value
              currency
            }
            discounts {
              amount {
                value
                currency
              }
              label
            }
            applied_taxes {
              amount {
                value
                currency
              }
              label
            }
          }
        }
      }
    `;

    const variables = isLoggedIn ? {} : { cartId };

    const response = await api.post("", {
      query: cartTotalsQuery,
      variables,
    });

    return isLoggedIn
      ? response.data.data.customerCart.prices
      : response.data.data.cart.prices;
  } catch (error) {
    console.error(
      "❌ Error fetching cart totals:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch cart totals");
  }
};

export default {
  getCart,
  getGlobalCartData,
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  getCartTotals,
  mergeGuestCart,
  getCustomerInfo,
};
