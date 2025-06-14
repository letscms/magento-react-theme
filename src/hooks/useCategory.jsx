import { useState, useCallback, useRef } from "react";
import * as categoryApi from "../api/category";

/**
 * Custom hook for working with categories
 */
export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState(null); 
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({
    items: [],
    total_count: 0,
  });
  const [productFilters, setProductFilters] = useState([]);
  const [cachedCategoryDetails, setCachedCategoryDetails] = useState({}); // Cache for category details by URL key
  const [cachedBreadcrumbs, setCachedBreadcrumbs] = useState({}); // Cache for breadcrumbs by category ID


  // Use refs to store the latest state values without causing re-renders
  const stateRef = useRef({
    categories,
    categoryTree,
   
    error,
    currentCategory,
    categoryProducts,
    productFilters,
    cachedCategoryDetails, // Add to ref
    cachedBreadcrumbs,   // Add to ref
  });

  // Update refs when state changes
  stateRef.current = {
    categories,
    categoryTree, 
    error,
    currentCategory,
    categoryProducts,
    productFilters,
    cachedCategoryDetails, // Update in ref
    cachedBreadcrumbs,   // Update in ref
  };

  /**
   * Load all categories
   */
  const loadCategories = useCallback(async () => {
   
    setError(null);

    try {
      const data = await categoryApi.getAllCategories();
      const items = data.items || [];
      setCategories(items);
      return items;
    } catch (err) {
      setError(err.message || "Failed to load categories");
      return [];
    } finally {
     
    }
  }, []); // Empty dependency array to ensure stable reference

  /**
   * Load category tree
   * @param {number} rootCategoryId - Root category ID
   */
  const loadCategoryTree = useCallback(async (rootCategoryId = 2) => {
    
    setError(null);

    try {
      const data = await categoryApi.getCategoryTree(rootCategoryId);
      setCategoryTree(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load category tree");
      return null;
    } finally {
     
    }
  }, []);

  /**
   * Load category by ID
   * @param {number} categoryId - Category ID
   */
  const loadCategoryById = useCallback(async (categoryId) => {
  
    setError(null);

    try {
      const data = await categoryApi.getCategoryById(categoryId);
      setCurrentCategory(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load category ${categoryId}`);
      return null;
    } finally {
     
    }
  }, []);

  /**
   * Load category by URL key/slug
   * @param {string} urlKey - Category URL key or slug
   */
  const loadCategoryByUrlKey = useCallback(async (urlKey) => {
  
    setError(null);

    if (stateRef.current.cachedCategoryDetails[urlKey]) {
      const cachedData = stateRef.current.cachedCategoryDetails[urlKey];
      setCurrentCategory(cachedData);
    
      return cachedData;
    }

    try {
      const data = await categoryApi.getCategoryByUrlKey(urlKey);
      if (data) {
        setCachedCategoryDetails(prev => ({ ...prev, [urlKey]: data }));
        setCurrentCategory(data);
      } else {
        // If API returns null/undefined (e.g. category not found),
        // still set currentCategory to null to reflect this.
        setCurrentCategory(null);
      }
      return data;
    } catch (err) {
      setError(err.message || `Failed to load category ${urlKey}`);
      setCurrentCategory(null); // Ensure currentCategory is reset on error
      return null;
    } finally {
    
    }
  }, [setCachedCategoryDetails, setCurrentCategory,, setError]); // Dependencies updated

  /**
   * Load products for a category
   * @param {number|string} categoryIdentifier - Category ID or URL key
   * @param {Object} options - Search options
   */
  const loadCategoryProducts = useCallback(
    async (categoryIdentifier, options = {}) => {
     
      setError(null);

      try {
        let data;

        if (typeof categoryIdentifier === "number") {
          data = await categoryApi.getProductsByCategory(
            categoryIdentifier,
            options
          );
        } else {
          data = await categoryApi.getProductsByCategoryUrlKey(
            categoryIdentifier,
            options
          );
        }

        setCategoryProducts(data);
        return data;
      } catch (err) {
        setError(
          err.message ||
            `Failed to load products for category ${categoryIdentifier}`
        );
        return { items: [], total_count: 0 };
      } finally {
        
      }
    },
    []
  );

  /**
   * Load child categories
   * @param {number} parentId - Parent category ID
   */
  const loadChildCategories = useCallback(async (parentId) => {
    
    setError(null);

    try {
      const data = await categoryApi.getChildCategories(parentId);
      return data.items || [];
    } catch (err) {
      setError(
        err.message || `Failed to load child categories for ${parentId}`
      );
      return [];
    } finally {
      
    }
  }, []);

  /**
   * Load category filters
   * @param {number} categoryId - Category ID
   */
  const loadCategoryFilters = useCallback(async (categoryId) => {
   
    setError(null);

    try {
      const data = await categoryApi.getCategoryFilters(categoryId);
      setProductFilters(data);
      return data;
    } catch (err) {
      setError(
        err.message || `Failed to load filters for category ${categoryId}`
      );
      return [];
    } finally {
   
    }
  }, []);

  /**
   * Load featured categories
   * @param {number} limit - Maximum number of categories
   */
  const loadFeaturedCategories = useCallback(async (limit = 10) => {
    
    setError(null);

    try {
      const data = await categoryApi.getFeaturedCategories(limit);
      return data.items || [];
    } catch (err) {
      setError(err.message || "Failed to load featured categories");
      return [];
    } finally {
     
    }
  }, []);

  /**
   * Search categories
   * @param {string} searchTerm - Search term
   * @param {number} limit - Maximum number of results
   */
  const searchCategoriesByName = useCallback(async (searchTerm, limit = 20) => {
  
    setError(null);

    try {
      const data = await categoryApi.searchCategories(searchTerm, limit);
      return data.items || [];
    } catch (err) {
      setError(
        err.message || `Failed to search categories for "${searchTerm}"`
      );
      return [];
    } finally {
      
    }
  }, []);

  /**
   * Get breadcrumbs for a category
   * @param {number} categoryId - Category ID
   */
  const getCategoryBreadcrumbs = useCallback(async (categoryId) => {
  setError(null);

  // Fix: Remove the incorrect curteRef reference
  if (stateRef.current.cachedBreadcrumbs[categoryId]) {     
    return stateRef.current.cachedBreadcrumbs[categoryId];
  }

  try {
    const pathCategories = await categoryApi.getCategoryPath(categoryId);
    const breadcrumbsData = pathCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      url: `/category/${cat.url_key || cat.id}`,
    }));
    if (breadcrumbsData.length > 0) { // Only cache if we got valid breadcrumbs
      setCachedBreadcrumbs(prev => ({ ...prev, [categoryId]: breadcrumbsData }));
    }
    return breadcrumbsData;
  } catch (err) {
    setError(
      err.message || `Failed to get breadcrumbs for category ${categoryId}`
    );
    return [];
  } finally {
        }
  }, [setCachedBreadcrumbs, setError]); // Dependencies updated

  // Clear error utility function
  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    categories,
    categoryTree,   
    error,
    currentCategory,
    categoryProducts,
    productFilters,
    // Expose caches if needed for debugging or direct manipulation (optional)
    // cachedCategoryDetails,
    // cachedBreadcrumbs,

    // Methods
    loadCategories,
    loadCategoryTree,
    loadCategoryById,
    loadCategoryByUrlKey,
    loadCategoryProducts,
    loadChildCategories,
    loadCategoryFilters,
    loadFeaturedCategories,
    searchCategoriesByName,
    getCategoryBreadcrumbs,

    // Utilities
    clearError,
  };
};

// Also keep the default export for backward compatibility
export default useCategory;
