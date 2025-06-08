/**
 * Simple in-memory cache utility for API requests
 * Supports promise sharing to prevent duplicate in-flight requests
 */

// Cache storage for completed requests
const cache = {};

// In-flight requests storage (promises that are still resolving)
const pendingRequests = {};

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Get data from cache or execute the fetcher function
 * 
 * @param {string} key - Unique cache key
 * @param {Function} fetcher - Function that returns a promise with the data
 * @param {Object} options - Cache options
 * @param {number} options.cacheTime - Time in milliseconds to keep the cache valid
 * @returns {Promise} - Promise that resolves with the data
 */
export const getCachedData = (key, fetcher, options = {}) => {
  const { cacheTime = DEFAULT_CACHE_TIME } = options;
  
  // Check if we already have valid cached data
  if (cache[key] && cache[key].expiry > Date.now()) {
    return Promise.resolve(cache[key].data);
  }
  
  // Check if we have a pending request for this key
  if (pendingRequests[key]) {   
    return pendingRequests[key];
  }
    
  // Store the promise in pendingRequests
  const promise = fetcher().then(data => {
    // Store the result in cache
    cache[key] = {
      data,
      expiry: Date.now() + cacheTime
    };
    
    // Remove from pending requests
    delete pendingRequests[key];
    
    return data;
  }).catch(error => {
    // Remove from pending requests on error
    delete pendingRequests[key];
    throw error;
  });
  
  pendingRequests[key] = promise;
  return promise;
};

/**
 * Invalidate a specific cache entry
 * 
 * @param {string} key - Cache key to invalidate
 */
export const invalidateCache = (key) => {
  if (cache[key]) {
    delete cache[key];  
  }
};

/**
 * Clear all cache entries
 */
export const clearCache = () => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

export default {
  getCachedData,
  invalidateCache,
  clearCache
};