import { getCachedData } from './cacheUtils';

// Cache keys for product-related data
export const PRODUCT_CACHE_KEYS = {
  ALL_PRODUCTS: (criteria) => `all-products-${JSON.stringify(criteria || {})}`,
  PRODUCT_BY_ID: (id) => `product-${id}`,
  PRODUCT_BY_SKU: (sku) => `product-sku-${sku}`,
  PRODUCT_BY_URL_KEY: (urlKey) => `product-url-${urlKey}`,
  SEARCH_PRODUCTS: (term, page, size) => `search-products-${term}-${page}-${size}`,
  FEATURED_PRODUCTS: (size) => `featured-products-${size}`,
  NEW_PRODUCTS: (size) => `new-products-${size}`,
  BEST_SELLING: (size) => `best-selling-${size}`,
  RELATED_PRODUCTS: (sku) => `related-products-${sku}`,
  CROSS_SELL: (sku) => `cross-sell-${sku}`,
  UP_SELL: (sku) => `up-sell-${sku}`,
  PRODUCT_REVIEWS: (sku) => `product-reviews-${sku}`,
  PRODUCT_ATTRIBUTES: (code) => `product-attributes-${code}`,
  PRODUCTS_BY_CATEGORY: (categoryId, criteria) => `products-category-${categoryId}-${JSON.stringify(criteria || {})}`,
  PRODUCT_FILTERS: (categoryId) => `product-filters-${categoryId}`,
  PRODUCT_STOCK: (sku) => `product-stock-${sku}`,
  GLOBAL_PRODUCT_AGGREGATIONS: 'global-product-aggregations', // New key
};

// Default cache times
const CACHE_TIMES = {
  PRODUCT_LIST: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutes
  PRODUCT_ATTRIBUTES: 30 * 60 * 1000, // 30 minutes
  PRODUCT_REVIEWS: 5 * 60 * 1000, // 5 minutes
  PRODUCT_STOCK: 2 * 60 * 1000, // 2 minutes (shorter for stock info)
  GLOBAL_PRODUCT_AGGREGATIONS: 30 * 60 * 1000, // 30 minutes, similar to attributes/filters
};

/**
 * Get cached product data
 * @param {string} key - Cache key
 * @param {Function} fetcher - Function to fetch data if not in cache
 * @param {string} cacheType - Type of cache (for determining expiration)
 * @returns {Promise} - Promise resolving to data
 */
export const getCachedProductData = (key, fetcher, cacheType = 'PRODUCT_LIST') => {
  return getCachedData(
    key,
    fetcher,
    { cacheTime: CACHE_TIMES[cacheType] }
  );
};

export default {
  PRODUCT_CACHE_KEYS,
  CACHE_TIMES,
  getCachedProductData
};