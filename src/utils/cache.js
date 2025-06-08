/**
 * Cache utility for storing and retrieving data from localStorage or sessionStorage
 * Supports expiration time for cached items
 */

// Default cache expiration time (24 hours in milliseconds)
const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Save data to cache
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 * @param {number} options.expiration - Expiration time in milliseconds
 */
export const saveToCache = (key, value, options = {}) => {
  try {
    const storage = options.session ? sessionStorage : localStorage;
    const data = {
      value,
      expiration: options.expiration ? Date.now() + options.expiration : Date.now() + DEFAULT_EXPIRATION,
    };
    storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getFromCache = (key, options = {}) => {
  try {
    const storage = options.session ? sessionStorage : localStorage;
    const data = storage.getItem(key);
    
    if (!data) return null;
    
    const parsedData = JSON.parse(data);
    
    // Check if data has expired
    if (parsedData.expiration && parsedData.expiration < Date.now()) {
      removeFromCache(key, options);
      return null;
    }
    
    return parsedData.value;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

/**
 * Remove data from cache
 * @param {string} key - Cache key
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 */
export const removeFromCache = (key, options = {}) => {
  try {
    const storage = options.session ? sessionStorage : localStorage;
    storage.removeItem(key);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
};

/**
 * Clear all cached data
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 */
export const clearCache = (options = {}) => {
  try {
    const storage = options.session ? sessionStorage : localStorage;
    storage.clear();
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Check if a key exists in cache and is not expired
 * @param {string} key - Cache key
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 * @returns {boolean} True if key exists and is not expired
 */
export const existsInCache = (key, options = {}) => {
  return getFromCache(key, options) !== null;
};

/**
 * Update a specific field in a cached object
 * @param {string} key - Cache key
 * @param {string} field - Field to update
 * @param {any} value - New value
 * @param {Object} options - Cache options
 * @param {boolean} options.session - Use sessionStorage instead of localStorage
 * @returns {boolean} Success status
 */
export const updateCacheField = (key, field, value, options = {}) => {
  try {
    const data = getFromCache(key, options);
    if (!data || typeof data !== 'object') return false;
    
    data[field] = value;
    saveToCache(key, data, options);
    return true;
  } catch (error) {
    console.error('Error updating cache field:', error);
    return false;
  }
};