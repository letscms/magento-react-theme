import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import productApi from "../api/product.jsx";

// Create the context
const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  // State for different product collections
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [productFilters, setProductFilters] = useState({}); // For category-specific filters
  const [globalProductAggregations, setGlobalProductAggregations] = useState(
    []
  ); // For global aggregations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Initialize with basic product data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        // const featured = await productApi.getFeaturedProducts(10);
        // setFeaturedProducts(featured.items || []);

        // Fetch new products
        // const newProds = await productApi.getNewProducts(10);
        // setNewProducts(newProds.items || []);

        // Fetch best selling products
        // const bestSelling = await productApi.getBestSellingProducts(10);
        // setBestSellingProducts(bestSelling.items || []);

        setLastFetched(new Date());
        setError(null);
      } catch (err) {
        console.error("Error in ProductContext initialization:", err);
        setError(err.message || "Failed to fetch initial product data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Get all products with search criteria
  const getProducts = useCallback(
    async (searchCriteria = {}) => {
      // Ensure cacheKey is consistent and includes searchTerm if present
      const { searchTerm, ...otherCriteria } = searchCriteria;
      const cacheKeyParts = [JSON.stringify(otherCriteria)];
      if (searchTerm) {
        cacheKeyParts.push(`searchTerm-${searchTerm}`);
      }
      const cacheKey = cacheKeyParts.join("-");
      setLoading(true); // Set loading true at the start
      if (allProducts[cacheKey]) {
        setLoading(false); // Set loading false if returning from cache
        return allProducts[cacheKey];
      }
      try {
        // setLoading(true); // Already set at the start
        const products = await productApi.getProducts(searchCriteria);
        setAllProducts( products);
        return products;
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
        return { items: [], total_count: 0 };
      } finally {
        setLoading(false);
      }
    },
    [allProducts, setLoading, setAllProducts, setError]
  );

  // Get product by ID
  const getProductById = useCallback(
    async (id) => {
      if (productDetails[`id-${id}`]) {
        return productDetails[`id-${id}`];
      }
      try {
        // setLoading(true); // Managed by useProduct hook locally
        const product = await productApi.getProductById(id);
        setProductDetails((prev) => ({ ...prev, [`id-${id}`]: product }));
        return product;
      } catch (err) {
        console.error(`Error fetching product with ID ${id}:`, err);
        // setError(err.message || `Failed to fetch product with ID ${id}`); // Managed by useProduct hook locally
        throw err; // Re-throw for useProduct to catch and set its local error
      } finally {
        // setLoading(false); // Managed by useProduct hook locally
      }
    },
    [setProductDetails]
  );

  // Get product by SKU
  const getProductBySku = useCallback(
    async (sku) => {
      if (productDetails[`sku-${sku}`]) {
        return productDetails[`sku-${sku}`];
      }
      try {
        // setLoading(true); // Managed by useProduct hook locally
        const product = await productApi.getProductBySku(sku);
        setProductDetails((prev) => ({ ...prev, [`sku-${sku}`]: product }));
        return product;
      } catch (err) {
        console.error(`Error fetching product with SKU ${sku}:`, err);
        // setError(err.message || `Failed to fetch product with SKU ${sku}`); // Managed by useProduct hook locally
        throw err; // Re-throw for useProduct to catch
      } finally {
        // setLoading(false); // Managed by useProduct hook locally
      }
    },
    [setProductDetails]
  );

  // Get product by URL key
  const getProductByUrlKey = useCallback(
    async (urlKey) => {
      if (productDetails[`url-${urlKey}`]) {
        return productDetails[`url-${urlKey}`];
      }
      try {
        // setLoading(true); // Managed by useProduct hook locally
        const product = await productApi.getProductByUrlKey(urlKey);
        setProductDetails((prev) => ({ ...prev, [`url-${urlKey}`]: product }));
        return product;
      } catch (err) {
        console.error(`Error fetching product with URL key ${urlKey}:`, err);
        // setError(err.message || `Failed to fetch product with URL key ${urlKey}`); // Managed by useProduct hook locally
        throw err; // Re-throw for useProduct to catch
      } finally {
        // setLoading(false); // Managed by useProduct hook locally
      }
    },
    [setProductDetails]
  );

  // Search products
  const searchProducts = useCallback(
    async (searchCriteria = {}) => {
      const {
        searchQuery, // This is the actual search term
        currentPage,
        pageSize,
        sortField,
        sortDirection,
        filterGroups,
        ...otherOptions // Collect any other potential options
      } = searchCriteria;

      // Construct a more robust cache key
      const cacheKeyParts = [
        `query-${searchQuery}`,
        `page-${currentPage || 1}`,
        `size-${pageSize || 20}`,
        `sort-${sortField || 'relevance'}_${sortDirection || 'DESC'}`,
      ];
      if (filterGroups && filterGroups.length > 0) {
        cacheKeyParts.push(`filters-${JSON.stringify(filterGroups)}`);
      }
      const cacheKey = cacheKeyParts.join('-');

      setLoading(true);
      if (searchResults[cacheKey]) {
        setLoading(false);
        return searchResults[cacheKey];
      }
      try {
        // Prepare options for productApi.searchProducts
        // Assuming productApi.searchProducts expects searchTerm and an options object
        const apiOptions = {
          currentPage,
          pageSize,
          sortField,
          sortDirection,
          filterGroups,
          ...otherOptions, // Spread any other options
        };
        
        const results = await productApi.searchProducts(searchQuery, apiOptions);
        setSearchResults((prev) => ({ ...prev, [cacheKey]: results }));
        return results;
      } catch (err) {
        console.error(
          `Error searching products for term "${searchQuery}":`,
          err
        );
        setError(
          err.message || `Failed to search products for "${searchQuery}"`
        );
        return { items: [], total_count: 0 }; // Ensure consistent return on error
      } finally {
        setLoading(false);
      }
    },
    [searchResults, setLoading, setSearchResults, setError]
  );

  // Get products by category
  const getProductsByCategory = useCallback(
    async (categoryId, searchCriteria = {}) => {
      const cacheKey = `${categoryId}-${JSON.stringify(searchCriteria)}`;
      setLoading(true); // Set loading true at the start
      if (productsByCategory[cacheKey]) {
        setLoading(false); // Set loading false if returning from cache
        return productsByCategory[cacheKey];
      }
      try {
        // setLoading(true); // Already set at the start
        const products = await productApi.getProductsByCategory(
          categoryId,
          searchCriteria
        );
        setProductsByCategory((prev) => ({ ...prev, [cacheKey]: products }));
        return products;
      } catch (err) {
        console.error(
          `Error fetching products for category ${categoryId}:`,
          err
        );
        setError(
          err.message || `Failed to fetch products for category ${categoryId}`
        );
        return { items: [], total_count: 0 };
      } finally {
        setLoading(false);
      }
    },
    [productsByCategory, setLoading, setProductsByCategory, setError]
  );

  // Get product filters for category
  const getProductFilters = useCallback(
    async (categoryId) => {
      setLoading(true); // Set loading true at the start
      if (productFilters[categoryId]) {
        setLoading(false); // Set loading false if returning from cache
        return productFilters[categoryId];
      }
      try {
        // setLoading(true); // Already set at the start
        const filters = await productApi.getProductFilters(categoryId);
        setProductFilters((prev) => ({ ...prev, [categoryId]: filters }));
        return filters;
      } catch (err) {
        console.error(
          `Error fetching filters for category ${categoryId}:`,
          err
        );
        setError(
          err.message || `Failed to fetch filters for category ${categoryId}`
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [productFilters, setLoading, setProductFilters, setError]
  );

  // Get global product aggregations
  const fetchGlobalProductAggregations = useCallback(async () => {
    // Check if already fetched to avoid redundant calls, simple check for now
    if (globalProductAggregations.length > 0) {
      return globalProductAggregations;
    }
    try {
      setLoading(true);
      const aggregations = await productApi.getGlobalProductAggregations();
      setGlobalProductAggregations(aggregations || []);
      return aggregations || [];
    } catch (err) {
      console.error("Error fetching global product aggregations:", err);
      setError(err.message || "Failed to fetch global product aggregations");
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
  }, [
    globalProductAggregations,
    setLoading,
    setGlobalProductAggregations,
    setError,
  ]);

  // Force refresh function to manually trigger a refetch of all data
  const refreshAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      // const featured = await productApi.getFeaturedProducts(10);
      // setFeaturedProducts(featured.items || []);
      // const newProds = await productApi.getNewProducts(10);
      // setNewProducts(newProds.items || []);
      const bestSelling = await productApi.getBestSellingProducts(10);
      setBestSellingProducts(bestSelling.items || []);
      setAllProducts({});
      setProductDetails({});
      setProductsByCategory({});
      setSearchResults({});
      setProductFilters({});
      setGlobalProductAggregations([]); // Clear global aggregations on refresh
      setLastFetched(new Date());
      setError(null);
      return true;
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError(err.message || "Failed to refresh products");
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    setFeaturedProducts,
    setNewProducts,
    setBestSellingProducts,
    setAllProducts,
    setProductDetails,
    setProductsByCategory,
    setSearchResults,
    setProductFilters,
    setGlobalProductAggregations,
    setLastFetched,
    setError,
  ]);

  // Get related products for a product
  const getRelatedProducts = useCallback(async (sku) => {
    try {
      return await productApi.getRelatedProducts(sku);
    } catch (err) {
      console.error(`Error fetching related products for SKU ${sku}:`, err);
      return [];
    }
  }, []);

  // Get cross-sell products for a product
  const getCrossSellProducts = useCallback(async (sku) => {
    try {
      return await productApi.getCrossSellProducts(sku);
    } catch (err) {
      console.error(`Error fetching cross-sell products for SKU ${sku}:`, err);
      return [];
    }
  }, []);

  // Get up-sell products for a product
  const getUpSellProducts = useCallback(async (sku) => {
    try {
      return await productApi.getUpSellProducts(sku);
    } catch (err) {
      console.error(`Error fetching up-sell products for SKU ${sku}:`, err);
      return [];
    }
  }, []);

  // Get product reviews
  const getProductReviews = useCallback(async (sku) => {
    try {
      return await productApi.getProductReviews(sku);
    } catch (err) {
      console.error(`Error fetching reviews for SKU ${sku}:`, err);
      return [];
    }
  }, []);

  // Submit product review
  const submitProductReview = useCallback(async (sku, reviewData) => {
    try {
      return await productApi.submitProductReview(sku, reviewData);
    } catch (err) {
      console.error(`Error submitting review for SKU ${sku}:`, err);
      throw err; // Re-throw to allow calling component to handle
    }
  }, []);

  // Get product stock status
  const getProductStockStatus = useCallback(async (sku) => {
    try {
      return await productApi.getProductStockStatus(sku);
    } catch (err) {
      console.error(`Error fetching stock status for SKU ${sku}:`, err);
      throw err; // Re-throw to allow calling component to handle
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // Product collections
      featuredProducts,
      newProducts,
      bestSellingProducts,
      productFilters, // Category-specific filters
      globalProductAggregations, // Global aggregations

      // Loading and error states
      loading,
      error,
      lastFetched,

      // Methods to get products (now memoized)
      getProducts,
      getProductById,
      getProductBySku,
      getProductByUrlKey,
      searchProducts,
      getProductsByCategory,
      getProductFilters, // For category filters
      fetchGlobalProductAggregations, // For global aggregations

      // Related product methods (now memoized)
      getRelatedProducts,
      getCrossSellProducts,
      getUpSellProducts,

      // Review methods (now memoized)
      getProductReviews,
      submitProductReview,

      // Stock methods (now memoized)
      getProductStockStatus,

      // Refresh method (now memoized)
      refreshAllProducts,
    }),
    [
      featuredProducts,
      newProducts,
      bestSellingProducts,
      productFilters,
      globalProductAggregations,
      loading,
      error,
      lastFetched,
      getProducts,
      getProductById,
      getProductBySku,
      getProductByUrlKey,
      searchProducts,
      getProductsByCategory,
      getProductFilters,
      fetchGlobalProductAggregations,
      getRelatedProducts,
      getCrossSellProducts,
      getUpSellProducts,
      getProductReviews,
      submitProductReview,
      getProductStockStatus,
      refreshAllProducts,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
