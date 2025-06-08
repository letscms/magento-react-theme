import axios from "axios";
import {
  AUTH_TOKEN_KEY,
  USER_INFO_KEY,
  CART_KEY,
  MAGENTO_GUEST_CART_ID,
} from "../constants/storageKeys";
import { invalidateCache } from "./cacheUtils";


// Create an axios instance with default config for Magento API
const VITE_BASE_URL_FOR_GRAPHQL = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, ''); // Remove trailing slash if any
const GraphQLBASE_URL = `${VITE_BASE_URL_FOR_GRAPHQL}/graphql`; // Append /graphql. Ensures correct endpoint.
const GraphQLApi = axios.create({
  baseURL: GraphQLBASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to GraphQLApi to include auth token
GraphQLApi.interceptors.request.use(
  (config) => {
    const currentToken = authService.getToken();
    if (currentToken) {
      config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create an axios instance with default config for Magento API
// Clean up VITE_MAGENTO_API_URL to remove any accidental double slashes in the path
const rawMagentoApiUrl = import.meta.env.VITE_MAGENTO_API_URL || '';
let cleanedMagentoApiUrl = rawMagentoApiUrl;
const protocolSeparator = '://';
const protocolEndIndex = rawMagentoApiUrl.indexOf(protocolSeparator);

if (protocolEndIndex > -1) {
    const protocol = rawMagentoApiUrl.substring(0, protocolEndIndex + protocolSeparator.length);
    const pathPart = rawMagentoApiUrl.substring(protocolEndIndex + protocolSeparator.length);
    // Replace multiple slashes with a single slash in the path part
    cleanedMagentoApiUrl = protocol + pathPart.replace(/\/\/+/g, '/');
} else {
    // Fallback for URLs without a protocol (less likely for full base URLs)
    cleanedMagentoApiUrl = rawMagentoApiUrl.replace(/\/\/+/g, '/');
}
const BASE_URL = cleanedMagentoApiUrl;
const magentoApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For public endpoints that don't require customer authentication
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache keys for authentication-related data
export const AUTH_CACHE_KEYS = {
  USER_INFO: "user-info",
};

/**
 * Authentication service for managing user sessions with Magento
 */
class AuthService {
  /**
   * Create authenticated API instance
   * @param {string} token - Authentication token
   * @returns {Object} - Axios instance with auth headers
   */
  createAuthenticatedApi(token) {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Get the authentication token
   * @returns {string|null} The authentication token or null
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Set the authentication token
   * @param {string} token - The authentication token
   */
  setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    magentoApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Get the current user information
   * @returns {Object|null} User information or null
   */
  getUserInfo() {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Set user information in storage
   * @param {Object} user - User information object
   */
  setUserInfo(user) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }

  /**
   * Login user with email and password
   * @param {string} username - Customer email
   * @param {string} password - Customer password
   * @returns {Promise<string>} - Returns token on success
   */
  async login(username, password) {
    try {
      const response = await magentoApi.post("/integration/customer/token", {
        username,
        password,
      });

      // Store the token in localStorage
      if (response.data) {
        this.setToken(response.data);

        // Fetch and store user info
        await this.fetchAndStoreUserInfo();
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Refresh the authentication token
   * @returns {Promise<string|null>} - Returns new token or null if refresh fails
   */
  async refreshToken() {
    try {
      // Get stored user credentials if available
      const userInfo = this.getUserInfo();
      
      if (!userInfo || !userInfo.email) {
        console.warn("Cannot refresh token: No user information available");
        return null;
      }
      
      // Currently, we don't have a direct way to refresh customer tokens in Magento
      // We would need to implement a custom endpoint or use a different approach
      console.warn("Token refresh not implemented for customer tokens");
      return null;
      
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Fetch current user info and store it
   */
  async fetchAndStoreUserInfo() {
    try {
      const userData = await this.getCurrentCustomer();
      this.setUserInfo(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }

  /**
   * Register a new customer in Magento
   * @param {Object} customerData - Customer registration data
   * @returns {Promise} - Returns customer data on success
   */
  async register(customerData) {
    try {
      // Format the customer data according to Magento API requirements
      const formattedData = {
        customer: {
          email: customerData.email,
          firstname: customerData.firstName,
          lastname: customerData.lastName,
          store_id: 1, // Default store view
          website_id: 1, // Default website
        },
        password: customerData.password,
      };

      const response = await magentoApi.post("/customers", formattedData);
      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Get current customer information
   * @returns {Promise} - Returns customer data
   */
  async getCurrentCustomer() {
    try {
      const token = this.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await magentoApi.get("/customers/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Get customer error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Logout customer by revoking the token
   * @param {boolean} [callServer=true] - Whether to call server to invalidate token
   */
  async logout(callServer = true) {
    try {
      const token = this.getToken();

      if (token && callServer) {
        await magentoApi.post(
          "/customers/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Properly clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Remove Authorization header from axios instance
      delete magentoApi.defaults.headers.common["Authorization"];

      return true;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);

      // Clear specific keys and session on error too
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_INFO_KEY);
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(MAGENTO_GUEST_CART_ID);
      sessionStorage.clear();

      delete magentoApi.defaults.headers.common["Authorization"];
      return true;
    }
  }

  /**
   * Request password reset for a customer
   * @param {string} email - Customer email
   * @returns {Promise}
   */
  async requestPasswordReset(email) {
    try {
      const response = await magentoApi.put("/customers/password", {
        email,
        template: "email_reset",
        websiteId: 1,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Password reset request error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Reset customer password with reset token
   * @param {string} email - Customer email
   * @param {string} resetToken - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async resetPassword(email, resetToken, newPassword) {
    try {
      const response = await magentoApi.post("/customers/resetPassword", {
        email,
        resetToken,
        newPassword,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Update customer information
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} - Returns updated customer data
   */
  async updateCustomerInfo(customerData) {
    try {
      const token = this.getToken();
     

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await magentoApi.put(
        "/customers/me",
        {
          customer: customerData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update stored user info
      this.setUserInfo(response.data);   

      return response.data;
    } catch (error) {
      console.error(
        "Update customer error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Change customer password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const token = this.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await magentoApi.put(
        "/customers/me/password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Change password error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Set up auth header for all future requests
   */
  setupAuthHeader() {
    const token = this.getToken();
    if (token) {
      magentoApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  }
}

// Create and export a singleton instance
const authService = new AuthService();

// Add request interceptor to handle token refreshing and authentication
magentoApi.interceptors.request.use(
  (config) => {
    // Check if token exists in localStorage before each request
    const currentToken = authService.getToken();
    if (currentToken) {
      config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
magentoApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error is due to an expired token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
        // Try to refresh the token
      const originalRequest = error.config;
      
      // Prevent infinite refresh loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // For customer token refresh - currently not implemented
          const newToken = await authService.refreshToken();
          
          if (newToken) {
            // Update the request headers with the new token
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            
            // Retry the original request with the new token
            return magentoApi(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }
      
      // If we reach here, token refresh failed or was not attempted
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initialize auth headers on module import
authService.setupAuthHeader();

// Export the singleton instance as default
export default authService;

// For backwards compatibility, also export individual functions
export const createAuthenticatedApi = (token) =>
  authService.createAuthenticatedApi(token);
export const isAuthenticated = () => authService.isAuthenticated();
export const getToken = () => authService.getToken();
export const setToken = (token) => authService.setToken(token);
export const login = (username, password) =>
  authService.login(username, password);
export const logout = (callServer) => authService.logout(callServer);
export const register = (customerData) => authService.register(customerData);
export const getCurrentCustomer = () => authService.getCurrentCustomer();
export const requestPasswordReset = (email) =>
  authService.requestPasswordReset(email);
export const resetPassword = (email, resetToken, newPassword) =>
  authService.resetPassword(email, resetToken, newPassword);
export const updateCustomerInfo = (customerData) =>
  authService.updateCustomerInfo(customerData);
export const changePassword = (currentPassword, newPassword) =>
  authService.changePassword(currentPassword, newPassword);
export const setupAuthHeader = () => authService.setupAuthHeader();
export const refreshToken = () => authService.refreshToken();

// Export the configured axios instances for other API modules
export { magentoApi };
export { GraphQLApi };
