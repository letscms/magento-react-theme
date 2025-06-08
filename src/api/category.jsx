import { getCachedData, invalidateCache } from './cacheUtils';
import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';

// Cache keys for category-related data
const CACHE_KEYS = {
  ALL_CATEGORIES: 'all-categories',
  CATEGORY_TREE: (rootId) => `category-tree-${rootId}`,
  CATEGORY_BY_ID: (id) => `category-${id}`,
  CATEGORY_CHILDREN: (parentId) => `category-children-${parentId}`,
  CATEGORY_ATTRIBUTES: 'category-attributes',
  FEATURED_CATEGORIES: (limit) => `featured-categories-${limit}`,
  CATEGORY_FILTERS: (id) => `category-filters-${id}`,
  PRODUCTS_BY_CATEGORY: (id, options) => `products-category-${id}-${JSON.stringify(options)}`,
};

// GraphQL fragments for reuse - using only publicly accessible fields
const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on CategoryTree {
    id
    name
    url_key
    level
    path
    children_count
    image
    description
    meta_title
    meta_keywords
    meta_description
  }
`;

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on ProductInterface {
    id
    sku
    name
    url_key
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
        discount {
          amount_off
          percent_off
        }
      }
    }
    image {
      url
      label
    }
    small_image {
      url
      label
    }
    thumbnail {
      url
      label
    }
    short_description {
      html
    }
  }
`;

/**
 * Get all categories with URL keys
 * @returns {Promise} - Returns all categories with URL keys
 */
export const getAllCategories = async () => {
  return getCachedData(
    CACHE_KEYS.ALL_CATEGORIES,
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetAllCategories {
              categories {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  children {
                    id
                    name
                    url_key
                    level
                    path
                    children {
                      id
                      name
                      url_key
                      level
                      path
                    }
                  }
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        });

        // Process the category data to match the expected format
        const processedCategories = [];
        
        const processCategories = (categoryList, parentPath = '') => {
          const result = [];
          
          if (!categoryList) return result;
          
          for (const category of categoryList) {
            // Skip root categories (usually ID 1 and 2)
            if (category.id <= 2) {
              if (category.children && category.children.length > 0) {
                const children = processCategories(category.children);
                processedCategories.push(...children);
              }
              continue;
            }
            
            // Create a structured category object
            const categoryObj = {
              category_id: category.id,
              name: category.name,
              url_key: category.url_key || '',
              level: category.level,
              parent_id: category.path ? category.path.split('/').slice(-2, -1)[0] : null,
              path: parentPath ? `${parentPath}/${category.url_key || category.id}` : (category.url_key || String(category.id)),
              children: []
            };
            
            // Process children if any
            if (category.children && category.children.length > 0) {
              categoryObj.children = processCategories(
                category.children, 
                categoryObj.path
              );
            }
            
            // Add to result array
            result.push(categoryObj);
            processedCategories.push(categoryObj);
          }
          
          return result;
        };
        
        // Start processing from the root children
        if (data.categories && data.categories.items && data.categories.items.length > 0) {
          processCategories(data.categories.items);
        }
        
        // Return both the original response and the processed categories
        return {
          original: data.categories.items,
          items: processedCategories
        };
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Get category tree (hierarchical structure)
 * @param {number} rootCategoryId - Root category ID (default is 2 for most Magento stores)
 * @returns {Promise} - Returns category tree
 */
export const getCategoryTree = async (rootCategoryId = 2) => {
  return getCachedData(
    CACHE_KEYS.CATEGORY_TREE(rootCategoryId),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetCategoryTree($id: String!) {
              categories(filters: { ids: { eq: $id } }) {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  children {
                    id
                    name
                    url_key
                    level
                    path
                    children {
                      id
                      name
                      url_key
                      level
                      path
                      children {
                        id
                        name
                        url_key
                        level
                        path
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { id: String(rootCategoryId) },
          fetchPolicy: 'network-only'
        });
        
        // Process the category tree to ensure consistent format
        const processTree = (category) => {
          if (!category) return null;
          
          const processed = {
            category_id: category.id,
            id: category.id,
            name: category.name,
            url_key: category.url_key || '',
            level: category.level,
            path: category.path,
            children_data: []
          };
          
          if (category.children && category.children.length > 0) {
            processed.children_data = category.children.map(child => processTree(child));
          }
          
          return processed;
        };
        
        if (!data.categories || !data.categories.items || data.categories.items.length === 0) {
          return null;
        }
        
        return processTree(data.categories.items[0]);
      } catch (error) {
        console.error('Error fetching category tree:', error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Get category by ID
 * @param {number} categoryId - Category ID
 * @returns {Promise} - Returns category details
 */
export const getCategoryById = async (categoryId) => {
  return getCachedData(
    CACHE_KEYS.CATEGORY_BY_ID(categoryId),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetCategoryById($id: String!) {
              categories(filters: { ids: { eq: $id } }) {
                items {
                  ...CategoryFields
                }
              }
            }
            ${CATEGORY_FRAGMENT}
          `,
          variables: { id: String(categoryId) },
          fetchPolicy: 'network-only'
        });
        
        if (!data.categories || !data.categories.items || data.categories.items.length === 0) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        
        // Convert GraphQL response to match REST API format
        const category = data.categories.items[0];
        return {
          id: category.id,
          parent_id: category.path ? category.path.split('/').slice(-2, -1)[0] : null,
          name: category.name,
          is_active: true, // Assuming active since it was returned
          level: category.level,
          path: category.path,
          url_key: category.url_key,
          children_count: category.children_count || 0,
          meta_title: category.meta_title,
          meta_keywords: category.meta_keywords,
          meta_description: category.meta_description,
          image: category.image,
          description: category.description
        };
      } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Get category by URL key/slug
 * @param {string} urlKey - Category URL key or slug
 * @returns {Promise} - Returns category details
 */
export const getCategoryByUrlKey = async (urlKey) => {
  // This function doesn't use caching since URL keys might be used in navigation
  // and we want to ensure fresh data
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query GetCategoryByUrlKey($urlKey: String!) {
          categories(filters: { url_key: { eq: $urlKey } }) {
            items {
              ...CategoryFields
            }
          }
        }
        ${CATEGORY_FRAGMENT}
      `,
      variables: { urlKey },
      fetchPolicy: 'network-only'
    });
    
    if (!data.categories || !data.categories.items || data.categories.items.length === 0) {
      throw new Error(`Category with URL key "${urlKey}" not found`);
    }
    
    const category = data.categories.items[0];
    return {
      category_id: category.id,
      id: category.id,
      name: category.name,
      url_key: category.url_key,
      level: category.level,
      parent_id: category.path ? category.path.split('/').slice(-2, -1)[0] : null,
      path: category.path,
      image: category.image,
      description: category.description,
      meta_title: category.meta_title,
      meta_keywords: category.meta_keywords,
      meta_description: category.meta_description,
      children_count: category.children_count || 0,
      children: []
    };
  } catch (error) {
    console.error(`Error fetching category by URL key ${urlKey}:`, error);
    throw error;
  }
};

/**
 * Get products by category ID
 * @param {number} categoryId - Category ID
 * @param {Object} options - Search criteria options
 * @param {number} options.pageSize - Number of products per page
 * @param {number} options.currentPage - Current page number
 * @param {string} options.sortField - Field to sort by
 * @param {string} options.sortDirection - Sort direction (ASC or DESC)
 * @returns {Promise} - Returns products in the category
 */
export const getProductsByCategory = async (categoryId, options = {}) => {
  return getCachedData(
    CACHE_KEYS.PRODUCTS_BY_CATEGORY(categoryId, options),
    async () => {
      try {
        const {
          pageSize = 20,
          currentPage = 1,
          sortField = 'position',
          sortDirection = 'ASC'
        } = options;
        
        // Build sort input
        const sortInput = {};
        sortInput[sortField] = sortDirection.toLowerCase();
        
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductsByCategory(
              $categoryId: String!
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: { category_id: { eq: $categoryId } }
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductFields
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${PRODUCT_FRAGMENT}
          `,
          variables: {
            categoryId: String(categoryId),
            pageSize,
            currentPage,
            sort: sortInput
          },
          fetchPolicy: 'network-only'
        });
        
        // Convert GraphQL response to match REST API format
        return {
          items: data.products.items,
          total_count: data.products.total_count,
          search_criteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'category_id',
                    value: String(categoryId),
                    condition_type: 'eq'
                  }
                ]
              }
            ],
            page_size: pageSize,
            current_page: currentPage,
            sort_orders: [
              {
                field: sortField,
                direction: sortDirection
              }
            ]
          },
          page_info: data.products.page_info
        };
      } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        throw error;
      }
    },
    { cacheTime: 5 * 60 * 1000 } // 5 minutes cache for products (shorter than categories)
  );
};

/**
 * Get products by category URL key/slug
 * @param {string} urlKey - Category URL key or slug
 * @param {Object} options - Search criteria options
 * @returns {Promise} - Returns products in the category
 */
export const getProductsByCategoryUrlKey = async (urlKey, options = {}) => {
  try {
    const category = await getCategoryByUrlKey(urlKey);
    if (!category || !category.category_id) {
      throw new Error(`Invalid category with URL key "${urlKey}"`);
    }
    return getProductsByCategory(category.category_id, options);
  } catch (error) {
    console.error(`Error fetching products for category URL key ${urlKey}:`, error);
    throw error;
  }
};

/**
 * Get category attributes
 * @returns {Promise} - Returns category attributes
 */
export const getCategoryAttributes = async () => {
  // For public API, we'll return a simplified set of attributes
  // since customAttributeMetadata might require authentication
  return {
    items: [
      { attribute_code: "url_key", entity_type: "catalog_category" },
      { attribute_code: "description", entity_type: "catalog_category" },
      { attribute_code: "image", entity_type: "catalog_category" },
      { attribute_code: "meta_title", entity_type: "catalog_category" },
      { attribute_code: "meta_keywords", entity_type: "catalog_category" },
      { attribute_code: "meta_description", entity_type: "catalog_category" }
    ]
  };
};

/**
 * Get child categories of a parent category
 * @param {number} parentId - Parent category ID
 * @returns {Promise} - Returns child categories
 */
export const getChildCategories = async (parentId) => {
  return getCachedData(
    CACHE_KEYS.CATEGORY_CHILDREN(parentId),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetChildCategories($parentId: String!) {
              categories(filters: { parent_id: { eq: $parentId } }) {
                items {
                  ...CategoryFields
                }
              }
            }
            ${CATEGORY_FRAGMENT}
          `,
          variables: { parentId: String(parentId) },
          fetchPolicy: 'network-only'
        });
        
        if (!data.categories || !data.categories.items) {
          return { items: [] };
        }
        
        // Convert GraphQL response to match REST API format
        return {
          items: data.categories.items.map(child => ({
            id: child.id,
            parent_id: parentId,
            name: child.name,
            is_active: true,
            level: child.level,
            path: child.path,
            url_key: child.url_key,
            children_count: child.children_count || 0,
            image: child.image,
            description: child.description
          }))
        };
      } catch (error) {
        console.error(`Error fetching child categories for parent ${parentId}:`, error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Get category path (breadcrumbs)
 * @param {number} categoryId - Category ID
 * @returns {Promise} - Returns category path
 */
export const getCategoryPath = async (categoryId) => {
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query GetCategoryPath($categoryId: String!) {
          categories(filters: { ids: { eq: $categoryId } }) {
            items {
              id
              name
              url_key
              level
              path
              breadcrumbs {
                category_id
                category_name
                category_url_key
                category_level
              }
            }
          }
        }
      `,
      variables: { categoryId: String(categoryId) },
      fetchPolicy: 'network-only'
    });
    
    if (!data.categories || !data.categories.items || data.categories.items.length === 0) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    const category = data.categories.items[0];
    
    if (!category.breadcrumbs || category.breadcrumbs.length === 0) {
      return [{
        id: category.id,
        name: category.name,
        url_key: category.url_key,
        level: category.level
      }];
    }
    
    // GraphQL already provides breadcrumbs, so we can use them directly
    const pathCategories = category.breadcrumbs.map(crumb => ({
      id: crumb.category_id,
      name: crumb.category_name,
      url_key: crumb.category_url_key,
      level: crumb.category_level
    }));
    
    // Add the current category to the end
    pathCategories.push({
      id: category.id,
      name: category.name,
      url_key: category.url_key,
      level: category.level
    });
    
    return pathCategories;
  } catch (error) {
    console.error(`Error fetching category path for ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Get featured categories
 * @param {number} limit - Maximum number of categories to return
 * @returns {Promise} - Returns featured categories
 */
export const getFeaturedCategories = async (limit = 10) => {
  return getCachedData(
    CACHE_KEYS.FEATURED_CATEGORIES(limit),
    async () => {
      try {
        // For public API, we'll get categories with images as "featured"
        // since is_anchor filter might not be available without admin access
        const { data } = await apolloClient.query({
          query: gql`
            query GetFeaturedCategories {
              categories(filters: { level: { gt: "1" } }) {
                items {
                  id
                  name
                  url_key
                  level
                  path
                  image
                  children_count
                  description
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        });
        
        if (!data.categories || !data.categories.items) {
          return { items: [] };
        }
        
        // Filter to categories with images and limit the results
        const featuredCategories = data.categories.items
          .filter(category => category.image)
          .slice(0, limit);
        
        // Convert GraphQL response to match REST API format
        return {
          items: featuredCategories.map(category => ({
            id: category.id,
            name: category.name,
            url_key: category.url_key,
            level: category.level,
            path: category.path,
            image: category.image,
            children_count: category.children_count || 0,
            description: category.description
          }))
        };
      } catch (error) {
        console.error('Error fetching featured categories:', error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Get category filters (available filters for products in a category)
 * @param {number} categoryId - Category ID
 * @returns {Promise} - Returns available filters
 */
export const getCategoryFilters = async (categoryId) => {
  return getCachedData(
    CACHE_KEYS.CATEGORY_FILTERS(categoryId),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetCategoryFilters($categoryId: String!) {
              products(filter: { category_id: { eq: $categoryId } }) {
                aggregations {
                  attribute_code
                  count
                  label
                  options {
                    count
                    label
                    value
                  }
                }
              }
            }
          `,
          variables: { categoryId: String(categoryId) },
          fetchPolicy: 'network-only'
        });
        
        return {
          layer_filter: data.products.aggregations
        };
      } catch (error) {
        console.error(`Error fetching filters for category ${categoryId}:`, error);
        throw error;
      }
    },
    { cacheTime: 10 * 60 * 1000 } // 10 minutes cache
  );
};

/**
 * Search categories by name
 * @param {string} searchTerm - Search term
 * @param {number} limit - Maximum number of results
 * @returns {Promise} - Returns matching categories
 */
export const searchCategories = async (searchTerm, limit = 20) => {
  // Don't cache search results as they're typically one-time operations
  try {
    const { data } = await apolloClient.query({
      query: gql`
        query SearchCategories($searchTerm: String!) {
          categories(filters: { name: { match: $searchTerm } }) {
            items {
              id
              name
              url_key
              level
              path
              children_count
              image
              description
            }
          }
        }
      `,
      variables: { searchTerm },
      fetchPolicy: 'network-only'
    });
    
    if (!data.categories || !data.categories.items) {
      return { items: [] };
    }
    
    // Filter out root categories (usually ID 1 and 2)
    const filteredCategories = data.categories.items.filter(category => 
      category.id > 2 && category.level > 1
    );
    
    // Limit the results to the requested number
    const limitedCategories = filteredCategories.slice(0, limit);
    
    // Convert GraphQL response to match REST API format
    return {
      items: limitedCategories.map(category => ({
        id: category.id,
        name: category.name,
        url_key: category.url_key,
        level: category.level,
        path: category.path,
        children_count: category.children_count || 0,
        image: category.image,
        description: category.description
      }))
    };
  } catch (error) {
    console.error(`Error searching categories for "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Invalidate category cache
 * @param {string|null} categoryId - Category ID (null to invalidate all category caches)
 */
export const invalidateCategoryCache = (categoryId = null) => {
  if (categoryId) {
    // Invalidate specific category caches
    invalidateCache(CACHE_KEYS.CATEGORY_BY_ID(categoryId));
    invalidateCache(CACHE_KEYS.CATEGORY_CHILDREN(categoryId));
    invalidateCache(CACHE_KEYS.CATEGORY_FILTERS(categoryId));
    invalidateCache(CACHE_KEYS.PRODUCTS_BY_CATEGORY(categoryId, {}));
  } else {
    // Invalidate all category caches
    invalidateCache(CACHE_KEYS.ALL_CATEGORIES);
    invalidateCache(new RegExp(`^category-`));
    invalidateCache(new RegExp(`^products-category-`));
  }
};

const categoryService = {
  getAllCategories,
  getCategoryTree,
  getCategoryById,
  getCategoryByUrlKey,
  getProductsByCategory,
  getProductsByCategoryUrlKey,
  getCategoryAttributes,
  getChildCategories,
  getCategoryPath,
  getFeaturedCategories,
  getCategoryFilters,
  searchCategories,
  invalidateCategoryCache
};

export default categoryService;
