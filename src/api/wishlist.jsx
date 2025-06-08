import axios from "axios";
import { getToken } from "./auth";

// GraphQL API URL
const VITE_BASE_URL_FOR_GRAPHQL = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, ''); // Remove trailing slash if any

const GRAPHQL_URL = `${VITE_BASE_URL_FOR_GRAPHQL}/graphql`;

// Get all wishlist items for the current user
export const getWishlistItems = async () => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Authentication required",
      data: [],
    };
  }

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: `
          query GetWishlist {
            customer {
              wishlist {
                id
                items_count
                items {
                  id
                  product {
                    id
                    name
                    stock_status
                    sku
                    url_key
                  
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
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check for GraphQL errors
    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return {
        success: false,
        message:
          response.data.errors[0].message || "Failed to fetch wishlist items",
        data: [],
      };
    }
    // Transform the data to match the expected format
    const wishlistItems = response.data.data.customer.wishlist.items.map(
      (item) => ({
        _id: item.product.id,
        wishlistItemId: item.id, // Store the wishlist item ID
        name: item.product.name,
        sku: item.product.sku,
        url_key: item.product.url_key,
        price: item.product.price?.regularPrice?.amount?.value || 0,
        images: item.product.image ? [item.product.image.url] : [],
        stock_status: item.product.stock_status,
      })
    );

    return {
      success: true,
      data: wishlistItems,
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch wishlist items",
      data: [],
    };
  }
};

// Add a product to the wishlist
export const addToWishlist = async (productId) => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: `
          mutation AddProductToWishlist($productId: String!) {
            addProductsToWishlist(
              wishlistId: "0" 
              wishlistItems: [
                {
                  sku: $productId,
                  quantity: 1.0
                }
              ]
            ) {
              wishlist {
                id
                items_count
              }
              user_errors {
                code
                message
              }
            }
          }
        `,
        variables: {
          productId: String(productId),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check for GraphQL errors
    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return {
        success: false,
        message:
          response.data.errors[0].message ||
          "Failed to add product to wishlist",
      };
    }

    // Check for user errors in the response
    const userErrors = response.data.data.addProductsToWishlist.user_errors;
    if (userErrors && userErrors.length > 0) {
      return {
        success: false,
        message: userErrors[0].message || "Failed to add product to wishlist",
      };
    }

    return {
      success: true,
      message: "Product added to wishlist successfully",
      data: response.data.data.addProductsToWishlist.wishlist,
    };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to add product to wishlist",
    };
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
  const token = getToken();
  if (!token) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    // First, get the wishlist to find the correct wishlist item ID
    const wishlistResponse = await getWishlistItems();
    
    if (!wishlistResponse.success) {
      return wishlistResponse; // Return the error from getWishlistItems
    }
    
    // Find the wishlist item that corresponds to the product ID
    const wishlistItem = wishlistResponse.data.find(item => 
      item._id === productId || item.sku === productId
    );
    
    if (!wishlistItem) {
      console.error("Product not found in wishlist:", productId);
      return {
        success: false,
        message: "Product not found in wishlist",
      };
    }    
    const wishlistItemId = wishlistItem.wishlistItemId;
    // Now remove the item using the correct wishlist item ID
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: `
          mutation RemoveProductFromWishlist($wishlistItemId: ID!) {
            removeProductsFromWishlist(
              wishlistId: "0"
              wishlistItemsIds: [$wishlistItemId]
            ) {
              wishlist {
                id
                items_count
              }
              user_errors {
                code
                message
              }
            }
          }
        `,
        variables: {
          wishlistItemId: String(wishlistItemId),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Check for GraphQL errors
    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return {
        success: false,
        message:
          response.data.errors[0].message ||
          "Failed to remove product from wishlist",
      };
    }

    // Check for user errors in the response
    const userErrors =
      response.data.data.removeProductsFromWishlist.user_errors;
    if (userErrors && userErrors.length > 0) {
      return {
        success: false,
        message:
          userErrors[0].message || "Failed to remove product from wishlist",
      };
    }

    return {
      success: true,
      message: "Product removed from wishlist successfully",
      data: response.data.data.removeProductsFromWishlist.wishlist,
    };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    
    // If all else fails, try the SKU method as a fallback
    return removeFromWishlistBySku(productId);
  }
};

// Alternative method to remove from wishlist using SKU
// This function is kept for backward compatibility but is mainly used as a fallback
const removeFromWishlistBySku = async (productId) => {
  const token = getToken();

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: `
          mutation RemoveProductFromWishlistBySku($sku: String!) {
            removeProductsFromWishlist(
              wishlistId: "0"
              wishlistItemsIds: []
              skus: [$sku]
            ) {
              wishlist {
                id
                items_count
              }
              user_errors {
                code
                message
              }
            }
          }
        `,
        variables: {
          sku: String(productId),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check for GraphQL errors
    if (response.data.errors) {
      console.error("GraphQL errors (SKU method):", response.data.errors);
      return {
        success: false,
        message:
          response.data.errors[0].message ||
          "Failed to remove product from wishlist",
      };
    }

    // Check for user errors in the response
    const userErrors =
      response.data.data.removeProductsFromWishlist.user_errors;
    if (userErrors && userErrors.length > 0) {
      return {
        success: false,
        message:
          userErrors[0].message || "Failed to remove product from wishlist",
      };
    }

    return {
      success: true,
      message: "Product removed from wishlist successfully",
      data: response.data.data.removeProductsFromWishlist.wishlist,
    };
  } catch (error) {
    console.error("Error removing from wishlist (SKU method):", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to remove product from wishlist",
    };
  }
};
