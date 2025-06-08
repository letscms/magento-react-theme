import { useCallback, useState } from 'react';
import { useProducts as useProductContext } from '../context/ProductContext'; // Renamed to avoid conflict

/**
 * Custom hook for product operations, now using ProductContext.
 * This hook can be used to access product data and functions from the context,
 * and can also include additional view-specific logic or transformations.
 * @returns {Object} Product methods and state from context, plus any local enhancements.
 */
export const useProduct = () => {
  const context = useProductContext();

  // Local state for specific needs of this hook, if any.
  // For example, if we need to transform data from context or manage UI state.
  const [currentProductDetails, setCurrentProductDetails] = useState(null);
  const [currentProductLoading, setCurrentProductLoading] = useState(false);
  const [currentProductError, setCurrentProductError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Expose all methods and data from context
  const {
    // Product collections from context
    featuredProducts,
    newProducts,
    bestSellingProducts,
    
    productFilters, // Category-specific filters from context
    globalProductAggregations, // Global aggregations from context
    
    // Loading and error states from context
    loading: contextLoading, // Rename to avoid conflict if local loading is used
    error: contextError,     // Rename to avoid conflict if local error is used
    lastFetched,
    
    // Methods to get products from context
    getProducts,          // General product list
    // getProductById,    // These will be wrapped by local versions below
    // getProductBySku,
    // getProductByUrlKey,
    searchProducts,
    getProductsByCategory, // Products filtered by category
    getProductFilters,     // Method to fetch category-specific filters
    fetchGlobalProductAggregations, // Method to fetch global aggregations
    
    // Related product methods from context
    // getRelatedProducts, // Context provides this, let's see if we need a local version
    getCrossSellProducts,
    getUpSellProducts,
    
    // Review methods from context
    getProductReviews,
    submitProductReview,
    
    // Stock methods from context
    getProductStockStatus,
    
    // Refresh method from context
    refreshAllProducts
  } = context;

  // Wrapper for getProductBySku to manage local state for the specific product being viewed
  const fetchProductDetailsBySku = useCallback(async (sku) => {
    setCurrentProductLoading(true);
    setCurrentProductError(null);
    try {
      const productData = await context.getProductBySku(sku);
      setCurrentProductDetails(productData);
      if (productData && productData.sku) {
        const related = await context.getRelatedProducts(productData.sku);
        setRelatedProducts(related || []);
      }
      return productData;
    } catch (err) {
      setCurrentProductError(err.message || 'Failed to fetch product details by SKU');
      return null;
    } finally {
      setCurrentProductLoading(false);
    }
  }, [context]);


  const getProductsdata = useCallback( async (searchCriteria) => {
  try {
    const  data  = await context.getProducts(searchCriteria)
    return {
      items: data.items,
      total_count: data.total_count,
      page_info: data.page_info
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}, [context]);

  // Wrapper for getProductById
  const fetchProductDetailsById = useCallback(async (id) => {
    setCurrentProductLoading(true);
    setCurrentProductError(null);
    try {
      const productData = await context.getProductById(id);
      setCurrentProductDetails(productData);
      if (productData && productData.sku) {
        const related = await context.getRelatedProducts(productData.sku);
        setRelatedProducts(related || []);
      }
      return productData;
    } catch (err) {
      setCurrentProductError(err.message || 'Failed to fetch product details by ID');
      return null;
    } finally {
      setCurrentProductLoading(false);
    }
  }, [context]);
  
  // Wrapper for getProductByUrlKey
  const fetchProductDetailsByUrlKey = useCallback(async (urlKey) => {
    setCurrentProductLoading(true);
    setCurrentProductError(null);
    try {
      const productData = await context.getProductByUrlKey(urlKey);
      setCurrentProductDetails(productData);
      if (productData && productData.sku) {
        const related = await context.getRelatedProducts(productData.sku);
        setRelatedProducts(related || []);
      }
      return productData;
    } catch (err) {
      setCurrentProductError(err.message || 'Failed to fetch product details by URL key');
      return null;
    } finally {
      setCurrentProductLoading(false);
    }
  }, [context]);


  /**
   * Get a custom attribute value from the currently fetched product details.
   * @param {string} code - The attribute code
   * @returns {string|null} The attribute value or null if not found
   */
  const getCustomAttribute = useCallback((code) => {
    if (!currentProductDetails || !currentProductDetails.custom_attributes) return null;
    
    const attribute = currentProductDetails.custom_attributes.find(
      attr => attr.attribute_code === code
    );
    return attribute ? attribute.value : null;
  }, [currentProductDetails]);

  /**
   * Get product images from the currently fetched product details, ensuring the main image is first.
   * @returns {Array} Array of product images
   */
  const getProductImages = useCallback(() => {
    if (!currentProductDetails || !currentProductDetails.media_gallery_entries) return [];

    const images = currentProductDetails.media_gallery_entries.map(entry => ({
      id: entry.id,
      label: entry.label,
      position: entry.position,
      disabled: entry.disabled,
      file: entry.file,
      types: entry.types || [], 
    }));

    images.sort((a, b) => {
      const isAMain = a.types.includes('image');
      const isBMain = b.types.includes('image');

      if (isAMain && !isBMain) return -1;
      if (!isAMain && isBMain) return 1;
      return a.position - b.position;
    });

    return images;
  }, [currentProductDetails]);

  // Normalize search criteria - this can remain a local utility if needed
  // or moved to a general utils file if used elsewhere.
  const normalizeSearchCriteria = useCallback((criteria) => {
    if (!criteria || Object.keys(criteria).length === 0) {
      return { pageSize: 20, currentPage: 1, sortField: 'position', sortDirection: 'ASC' };
    }
    const isRestFormat = Object.keys(criteria).some(key => key.includes('searchCriteria'));
    if (isRestFormat) {
      const pageSize = criteria['searchCriteria[pageSize]'] || 20;
      const currentPage = criteria['searchCriteria[currentPage]'] || 1;
      let sortField = 'position';
      let sortDirection = 'ASC';
      if (criteria['searchCriteria[sortOrders][0][field]']) {
        sortField = criteria['searchCriteria[sortOrders][0][field]'];
      }
      if (criteria['searchCriteria[sortOrders][0][direction]']) {
        sortDirection = criteria['searchCriteria[sortOrders][0][direction]'].toUpperCase();
      }
      return {
        pageSize: parseInt(pageSize, 10),
        currentPage: parseInt(currentPage, 10),
        sortField,
        sortDirection,
        filterGroups: [] // Assuming filter groups are handled differently or added later
      };
    }
    return {
      ...criteria,
      sortDirection: criteria.sortDirection ? criteria.sortDirection.toUpperCase() : 'ASC'
    };
  }, []);


  // The hook now returns a combination of context values and its own specific logic/state.
  return {
    // Data from context (potentially renamed to avoid conflicts)
    featuredProducts,
    newProducts,
    bestSellingProducts,
    productFilters, // Category-specific filters
    globalProductAggregations, // Global aggregations
    contextLoading, // General loading state from context
    contextError,   // General error state from context
    lastFetched,

    // Specific product detail state managed by this hook
    product: currentProductDetails, // The single product detail fetched by this hook's methods
    relatedProducts, // Related products for the currentProductDetails
    loading: currentProductLoading, // Loading state for this hook's specific fetch operations
    error: currentProductError,     // Error state for this hook's specific fetch operations

    // Methods from context (can be used directly)
    getProducts,          // For fetching lists of products
    searchProducts,
    getProductsByCategory,
    getProductFilters,     // For category filters
    fetchGlobalProductAggregations, // For global aggregations
    getCrossSellProducts,
    getUpSellProducts,
    getProductReviews,
    submitProductReview,
    getProductStockStatus,
    refreshAllProducts,
getProductsdata,
    // Enhanced/specific methods from this hook
    getProductById: fetchProductDetailsById, // Now uses context and manages local state
    getProductBySku: fetchProductDetailsBySku, // Now uses context and manages local state
    getProductByUrlKey: fetchProductDetailsByUrlKey, // Now uses context and manages local state
    
    // Utility methods that might operate on local state or be general helpers
    getCustomAttribute,
    getProductImages,
    normalizeSearchCriteria, // If still needed by components using this hook
    
    // Context's getRelatedProducts is also available if needed directly:
    getRelatedProducts: context.getRelatedProducts 
  };
};

// Export as both default and named export for flexibility
export default useProduct;


