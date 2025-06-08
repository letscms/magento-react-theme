import { getCachedProductData } from "./productCacheUtils";
import { PRODUCT_CACHE_KEYS } from "./productCacheUtils";
import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";

// Define reusable fragments for GraphQL queries
const PRODUCT_BASIC_FRAGMENT = gql`
  fragment ProductBasicFields on ProductInterface {
    id
    sku
    name
    url_key
    type_id # Added to identify product type
    __typename # Added to get GraphQL object type
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
    small_image {
      url
      label
    }
  }
`;

const PRODUCT_DETAIL_FRAGMENT = gql`
  fragment ProductDetailFields on ProductInterface {
    ...ProductBasicFields
    description {
      html
    }
    short_description {
      html
    }
    meta_title
    meta_keyword
    meta_description
    media_gallery {
      url
      label
      position
    }
    categories {
      id
      name
      url_key
      url_path
    }
    stock_status
    only_x_left_in_stock
    rating_summary
    review_count
    special_price
    special_from_date
    special_to_date

    ... on ConfigurableProduct {
      configurable_options {
        id
        attribute_id
        label
        position
        use_default
        attribute_code
        values {
          value_index
          label
          swatch_data {
            # type field removed as it's not standard on SwatchDataInterface directly
            value # e.g., hex color, image path
            # thumbnail # Optionally query for thumbnail if your swatches use it
          }
        }
      }
      variants {
        product {
          id
          sku
          name # Add name for variant display
          stock_status # Add stock_status for variant
          price_range {
            # Add price for variant
            minimum_price {
              final_price {
                value
                currency
              }
              regular_price {
                value
                currency
              }
            }
          }
          small_image {
            url
            label
          }
          # Potentially more fields if needed for variant selection logic
        }
        attributes {
          code
          value_index
          label # Add label for variant attribute
        }
      }
    }

    ... on BundleProduct {
      items {
        option_id
        title
        required
        type
        position
        sku
        options {
          id
          quantity
          position
          is_default
          price
          price_type
          can_change_quantity
          label # Product name for the option
          product {
            id
            sku
            name
            stock_status
            price_range {
              minimum_price {
                final_price {
                  value
                  currency
                }
              }
            }
            small_image {
              url
              label
            }
          }
        }
      }
    }

    ... on DownloadableProduct {
      downloadable_product_links {
        id
        title
        price
        number_of_downloads
        is_shareable
        #link_file # Corrected from link_url, this is typically the relative path to the file
        sample_type # Added to know if sample is a URL or file
        sample_file # Path to sample file
        sample_url # URL for sample if it's an external link
        sort_order
      }
      downloadable_product_samples {
        id
        title
        sample_type # Added to know if sample is a URL or file
        sample_file # Path to sample file
        sample_url # URL for sample if it's an external link
        sort_order
      }
      links_purchased_separately
    }
    ... on GroupedProduct {
      items {
        product {
          id
          sku
          name
          type_id # Good to have for completeness
          stock_status
          url_key # For linking to the simple product page
          price_range {
            # Price of the individual simple product
            minimum_price {
              final_price {
                value
                currency
              }
              regular_price {
                value
                currency
              }
            }
          }
          small_image {
            url
            label
          }
          # ...ProductBasicFields # Alternatively, spread basic fields if all are needed
        }
        qty # This is default_quantity for the grouped product item
        position
      }
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`;

/**
 * Get products with filters
 * @param {Object} searchCriteria - Search criteria for filtering products
 * @returns {Promise} - Promise resolving to products data
 */
export const getProducts = async (searchCriteria = {}) => {
 
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.ALL_PRODUCTS(searchCriteria),
    async () => {
      try {
        // Extract pagination and sorting from search criteria
        const {
          pageSize = 20,
          currentPage = 1,
          // sortField and sortDirection will be determined below
          filterGroups = [],
          searchTerm, // Add searchTerm here
        } = searchCriteria;

        // Determine sort order
        // If a searchTerm is present and no specific sort is provided in searchCriteria, sort by relevance.
        // Otherwise, if no specific sort is provided, sort by position.
        const resolvedSortField = searchCriteria.sortField || (searchTerm ? "relevance" : "position");
        const resolvedSortDirection = searchCriteria.sortDirection || (searchTerm ? "DESC" : "ASC");

        // Build GraphQL filter from filterGroups
        const filter = {};
        if (Array.isArray(filterGroups)) {
          filterGroups.forEach((group) => {
            if (group && Array.isArray(group.filters)) {
              group.filters.forEach((filterItem) => {
                // Convert REST API filter to GraphQL filter
                const { field, value, condition_type, from, to } = filterItem; // Add from and to

                if (field === "price" && (from || to)) {
                  // Special handling for price range
                  if (!filter.price) {
                    filter.price = {};
                  }
                  if (from) {
                    filter.price.from = String(from); // Ensure string for GraphQL
                  }
                  if (to) {
                    filter.price.to = String(to); // Ensure string for GraphQL
                  }
                } else {
                  // Existing logic for other filters
                  if (!filter[field]) {
                    filter[field] = {};
                  }
                  // Map REST API condition types to GraphQL condition types
                  switch (condition_type) {
                    case "eq":
                      filter[field]["eq"] = value;
                      break;
                    case "neq":
                      filter[field]["neq"] = value;
                      break;
                    case "like":
                      filter[field]["match"] = value;
                      break;
                    case "in":
                      filter[field]["in"] = Array.isArray(value)
                        ? value
                        : [value];
                      break;
                    case "nin":
                      filter[field]["nin"] = Array.isArray(value)
                        ? value
                        : [value];
                      break;
                    case "gt":
                      filter[field]["gt"] = value;
                      break;
                    case "lt":
                      filter[field]["lt"] = value;
                      break;
                    case "gteq":
                      filter[field]["gteq"] = value;
                      break;
                    case "lteq":
                      filter[field]["lteq"] = value;
                      break;
                    default:
                      filter[field]["eq"] = value;
                  }
                }
              });
            }
          });
        }

        // Build sort input - IMPORTANT: Ensure sort direction is uppercase for GraphQL enum
        const sortInput = {};
        sortInput[resolvedSortField] = resolvedSortDirection.toUpperCase(); // Convert to uppercase for GraphQL enum

        // Execute GraphQL query
        const { data } = await apolloClient.query({
          query: gql`
            query GetProducts(
              $filter: ProductAttributeFilterInput
              $search: String # Add search term variable
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: $filter
                search: $search # Add search term to query
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  id
                  name
                  sku
                  url_key
                  stock_status
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
                  small_image {
                    url
                    label
                  }
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: {
            filter,
            search: searchTerm, // Pass searchTerm variable
            pageSize,
            currentPage,
            sort: sortInput,
          },
          fetchPolicy: "cache-first",
        });

        // Format response to match REST API structure
        return {
          items: data.products.items || [],
          total_count: data.products.total_count || 0,
          page_info: {
            page_size: searchCriteria.pageSize,
            current_page: searchCriteria.currentPage,
            total_pages: Math.ceil(data.products.total_count / searchCriteria.pageSize)
          }
        };
      } catch (error) {
        console.error("Error fetching products:", error);

        // Return empty result set on error to prevent UI crashes
        return {
          items: [],
          total_count: 0,
          search_criteria: searchCriteria,
          page_info: {
            page_size: searchCriteria.pageSize || 20,
            current_page: searchCriteria.currentPage || 1,
            total_pages: 0,
          },
        };
      }
    },
    "PRODUCT_LIST"
  );
};

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Promise} - Promise resolving to product data
 */
export const getProductById = async (id) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_BY_ID(id),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductById($id: Int!) {
              products(filter: { id: { eq: $id } }) {
                items {
                  ...ProductDetailFields
                }
              }
            }
            ${PRODUCT_DETAIL_FRAGMENT}
          `,
          variables: { id: parseInt(id, 10) },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          throw new Error(`Product with ID ${id} not found`);
        }

        return data.products.items[0];
      } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
      }
    },
    "PRODUCT_DETAIL"
  );
};

/**
 * Get product by SKU
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to product data
 */
export const getProductBySku = async (sku) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_BY_SKU(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductBySku($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  ...ProductDetailFields
                }
              }
            }
            ${PRODUCT_DETAIL_FRAGMENT}
          `,
          variables: { sku },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          throw new Error(`Product with SKU ${sku} not found`);
        }

        return data.products.items[0];
      } catch (error) {
        console.error(`Error fetching product with SKU ${sku}:`, error);
        throw error;
      }
    },
    "PRODUCT_DETAIL"
  );
};

/**
 * Get product by URL key
 * @param {string} urlKey - Product URL key
 * @returns {Promise} - Promise resolving to product data
 */
export const getProductByUrlKey = async (urlKey) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_BY_URL_KEY(urlKey),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductByUrlKey($urlKey: String!) {
              products(filter: { url_key: { eq: $urlKey } }) {
                items {
                  ...ProductDetailFields
                  id
                  name
                  sku
                  url_key
                  type_id
                  __typename
                  stock_status
                  description {
                    html
                  }
                  short_description {
                    html
                  }
                  meta_title
                  meta_keyword
                  meta_description

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
                  media_gallery {
                    url
                    label
                  }

                  ... on ConfigurableProduct {
                    configurable_options {
                      attribute_code
                      values {
                        uid
                        value_index
                        label
                      }
                    }
                    variants {
                      attributes {
                        code
                        value_index
                      }
                      product {
                        id
                        name
                        sku
                        stock_status
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
                      }
                    }
                  }

                  ... on DownloadableProduct {
                    downloadable_product_links {
                      id
                      title
                      price
                      sort_order
                    }
                  }

                  ... on GroupedProduct {
                    items {
                      position
                      qty
                      product {
                        id
                        name
                        sku
                        stock_status
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
                      }
                    }
                  }
                }
              }
            }
            ${PRODUCT_DETAIL_FRAGMENT}
          `,
          variables: { urlKey },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          throw new Error(`Product with URL key ${urlKey} not found`);
        }

        return data.products.items[0];
      } catch (error) {
        console.error(`Error fetching product with URL key ${urlKey}:`, error);
        throw error;
      }
    },
    "PRODUCT_DETAIL"
  );
};

/**
 * Search products
 * @param {string} searchTerm - Search term
 * @param {Object} options - Search options
 * @returns {Promise} - Promise resolving to search results
 */
export const searchProducts = async (searchTerm, options = {}) => {
  const {
    pageSize = 20,
    currentPage = 1,
    sortField = "relevance",
    sortDirection = "DESC",
    filterGroups = [],
  } = options;

  // Construct a comprehensive cache key
  const cacheKey = `search_products_term-${searchTerm}_page-${currentPage}_size-${pageSize}_sort-${sortField}-${sortDirection.toUpperCase()}_filters-${JSON.stringify(filterGroups)}`;

  return getCachedProductData(
    cacheKey, // Use the new comprehensive cache key
    async () => {
      try {
        // Options are already destructured above for cacheKey generation

        // Build sort input - ensure uppercase for GraphQL enum
        const sortInput = {};
        sortInput[sortField] = sortDirection.toUpperCase();

        // Build GraphQL filter from filterGroups (similar to getProducts)
        const gqlFilter = {};
        if (Array.isArray(filterGroups)) {
          filterGroups.forEach((group) => {
            if (group && Array.isArray(group.filters)) {
              group.filters.forEach((filterItem) => {
                const { field, value, condition_type, from, to } = filterItem;
                if (field === "price" && (from || to)) {
                  if (!gqlFilter.price) gqlFilter.price = {};
                  if (from) gqlFilter.price.from = String(from);
                  if (to) gqlFilter.price.to = String(to);
                } else {
                  if (!gqlFilter[field]) gqlFilter[field] = {};
                  switch (condition_type) {
                    case "eq": gqlFilter[field]["eq"] = value; break;
                    case "neq": gqlFilter[field]["neq"] = value; break;
                    case "like": gqlFilter[field]["match"] = value; break;
                    case "in": gqlFilter[field]["in"] = Array.isArray(value) ? value : [value]; break;
                    case "nin": gqlFilter[field]["nin"] = Array.isArray(value) ? value : [value]; break;
                    case "gt": gqlFilter[field]["gt"] = value; break;
                    case "lt": gqlFilter[field]["lt"] = value; break;
                    case "gteq": gqlFilter[field]["gteq"] = value; break;
                    case "lteq": gqlFilter[field]["lteq"] = value; break;
                    default: gqlFilter[field]["eq"] = value;
                  }
                }
              });
            }
          });
        }

        const { data } = await apolloClient.query({
          query: gql`
            query SearchProducts(
              $searchTerm: String!
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
              $filter: ProductAttributeFilterInput # Add filter variable
            ) {
              products(
                search: $searchTerm
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
                filter: $filter # Use filter in the query
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  id
                  sku
                  name
                  url_key
                  stock_status
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
                  small_image {
                    url
                    label
                  }
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: {
            searchTerm,
            pageSize,
            currentPage,
            sort: sortInput,
            filter: gqlFilter, // Pass the transformed filter
          },
          fetchPolicy: "cache-first",
        });

        return {
          items: data.products.items || [],
          total_count: data.products.total_count || 0,
          search_criteria: { // Reflect the criteria used
            search_term: searchTerm,
            page_size: pageSize,
            current_page: currentPage,
            sort_orders: [{ field: sortField, direction: sortDirection }],
            filter_groups: filterGroups, // Include original filter groups for context
          },
          page_info: data.products.page_info || {
            page_size: pageSize,
            current_page: currentPage,
            total_pages: Math.ceil((data.products.total_count || 0) / pageSize),
          },
        };
      } catch (error) {
        console.error(
          `Error searching products for term "${searchTerm}":`,
          error
        );
        return { // Return a consistent structure on error
          items: [],
          total_count: 0,
          search_criteria: {
            search_term: searchTerm,
            page_size: pageSize, // Use destructured pageSize
            current_page: currentPage, // Use destructured currentPage
            sort_orders: [{ field: sortField, direction: sortDirection.toUpperCase() }], // Use destructured sort
            filter_groups: filterGroups, // Use destructured filterGroups
          },
          page_info: {
            page_size: pageSize, // Use destructured pageSize
            current_page: currentPage, // Use destructured currentPage
            total_pages: 0,
          },
        };
      }
    },
    "PRODUCT_LIST" // Consider a more specific cache type if needed, e.g., "SEARCH_PRODUCT_LIST"
  );
};

/**
 * Get featured products
 * @param {number} pageSize - Number of products to fetch
 * @returns {Promise} - Promise resolving to featured products
 */
// export const getFeaturedProducts = async (pageSize = 10) => {
//   return getCachedProductData(
//     PRODUCT_CACHE_KEYS.FEATURED_PRODUCTS(pageSize),
//     async () => {
//       try {
//         const { data } = await apolloClient.query({
//           query: gql`
//             query GetFeaturedProducts($pageSize: Int!) {
//               products(
//                 filter: { is_featured: { eq: "1" } }
//                 pageSize: $pageSize
//                 sort: { position: ASC }
//               ) {
//                 total_count
//                 items {
//                   ...ProductBasicFields
//                 }
//               }
//             }
//             ${PRODUCT_BASIC_FRAGMENT}
//           `,
//           variables: { pageSize },
//           fetchPolicy: "cache-first",
//         });

//         return {
//           items: data.products.items || [],
//           total_count: data.products.total_count || 0,
//         };
//       } catch (error) {
//         console.error("Error fetching featured products:", error);
//         return { items: [], total_count: 0 };
//       }
//     },
//     "PRODUCT_LIST"
//   );
// };

/**
 * Get new products
 * @param {number} pageSize - Number of products to fetch
 * @returns {Promise} - Promise resolving to new products
 */
// export const getNewProducts = async (pageSize = 10) => {
//   return getCachedProductData(
//     PRODUCT_CACHE_KEYS.NEW_PRODUCTS(pageSize),
//     async () => {
//       try {
//         const { data } = await apolloClient.query({
//           query: gql`
//             query GetNewProducts($pageSize: Int!) {
//               products(
//                 filter: { news_from_date: { lt: "now" } }
//                 pageSize: $pageSize
//                 sort: { created_at: DESC }
//               ) {
//                 total_count
//                 items {
//                   ...ProductBasicFields
//                 }
//               }
//             }
//             ${PRODUCT_BASIC_FRAGMENT}
//           `,
//           variables: { pageSize },
//           fetchPolicy: "cache-first",
//         });

//         return {
//           items: data.products.items || [],
//           total_count: data.products.total_count || 0,
//         };
//       } catch (error) {
//         console.error("Error fetching new products:", error);
//         return { items: [], total_count: 0 };
//       }
//     },
//     "PRODUCT_LIST"
//   );
// };

/**
 * Get products by category ID
 * @param {number} categoryId - Category ID
 * @param {Object} searchCriteria - Additional search criteria
 * @returns {Promise} - Promise resolving to products in category
 */
export const getProductsByCategory = async (
  categoryId,
  searchCriteria = {}
) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCTS_BY_CATEGORY(categoryId, searchCriteria),
    async () => {
      try {
        // Extract pagination and sorting from search criteria
        const {
          pageSize = 20,
          currentPage = 1,
          sortField = "position",
          sortDirection = "ASC",
          filterGroups = [],
        } = searchCriteria;

        // Ensure sort direction is uppercase for GraphQL enum
        const normalizedSortDirection =
          typeof sortDirection === "string"
            ? sortDirection.toUpperCase()
            : "ASC";
        // Build additional filters from filterGroups
        const additionalFilters = {};
        if (Array.isArray(filterGroups)) {
          filterGroups.forEach((group) => {
            if (group && Array.isArray(group.filters)) {
              group.filters.forEach((filterItem) => {
                if (filterItem.field !== "category_id") {
                  // Skip category_id as we're already filtering by it
                  const { field, value, condition_type, from, to } = filterItem;

                  if (field === "price" && (from || to)) {
                    if (!additionalFilters.price) {
                      additionalFilters.price = {};
                    }
                    if (from && from !== "*") {
                      additionalFilters.price.from = String(from);
                    }
                    if (to && to !== "*") {
                      additionalFilters.price.to = String(to);
                    }
                  } else {
                    if (!additionalFilters[field]) {
                      additionalFilters[field] = {};
                    }
                    // Map REST API condition types to GraphQL condition types
                    switch (condition_type) {
                      case "eq":
                        additionalFilters[field]["eq"] = value;
                        break;
                      case "neq":
                        additionalFilters[field]["neq"] = value;
                        break;
                      case "like":
                        additionalFilters[field]["match"] = value;
                        break;
                      case "in":
                        additionalFilters[field]["in"] = Array.isArray(value)
                          ? value
                          : [value];
                        break;
                      case "nin":
                        additionalFilters[field]["nin"] = Array.isArray(value)
                          ? value
                          : [value];
                        break;
                      case "gt":
                        additionalFilters[field]["gt"] = value;
                        break;
                      case "lt":
                        additionalFilters[field]["lt"] = value;
                        break;
                      case "gteq":
                        additionalFilters[field]["gteq"] = value;
                        break;
                      case "lteq":
                        additionalFilters[field]["lteq"] = value;
                        break;
                      default:
                        // Only apply 'eq' if condition_type is truly undefined and not handled by other logic
                        if (typeof condition_type === 'undefined') {
                           additionalFilters[field]["eq"] = value;
                        }
                    }
                  }
                }
              });
            }
          });
        }

        // Build sort input - IMPORTANT: Ensure sort direction is uppercase for GraphQL enum
        const sortInput = {};
        sortInput[sortField] = normalizedSortDirection;
        // Combine category filter with additional filters
        const combinedFilter = {
          category_id: { eq: String(categoryId) },
          ...additionalFilters,
        };

        // Execute GraphQL query
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductsByCategory(
              $filter: ProductAttributeFilterInput
              $pageSize: Int!
              $currentPage: Int!
              $sort: ProductAttributeSortInput
            ) {
              products(
                filter: $filter
                pageSize: $pageSize
                currentPage: $currentPage
                sort: $sort
              ) {
                total_count
                items {
                  ...ProductBasicFields
                  stock_status
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
                  small_image {
                    url
                    label
                  }
                  rating_summary
                  review_count
                }
                page_info {
                  page_size
                  current_page
                  total_pages
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: {
            filter: combinedFilter,
            pageSize,
            currentPage,
            sort: sortInput,
          },
          fetchPolicy: "cache-first",
        });

        return {
          items: data.products.items || [],
          total_count: data.products.total_count || 0,
          search_criteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: "category_id",
                    value: String(categoryId),
                    condition_type: "eq",
                  },
                ],
              },
              ...filterGroups,
            ],
            page_size: pageSize,
            current_page: currentPage,
            sort_orders: [
              {
                field: sortField,
                direction: normalizedSortDirection,
              },
            ],
          },
          page_info: data.products.page_info || {
            page_size: pageSize,
            current_page: currentPage,
            total_pages: 0,
          },
        };
      } catch (error) {
        console.error(
          `Error fetching products for category ${categoryId}:`,
          error
        );

        // Return empty result set on error to prevent UI crashes
        return {
          items: [],
          total_count: 0,
          search_criteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: "category_id",
                    value: String(categoryId),
                    condition_type: "eq",
                  },
                ],
              },
            ],
            page_size: searchCriteria.pageSize || 20,
            current_page: searchCriteria.currentPage || 1,
            sort_orders: [
              {
                field: searchCriteria.sortField || "position",
                direction: (
                  searchCriteria.sortDirection || "ASC"
                ).toUpperCase(),
              },
            ],
          },
          page_info: {
            page_size: searchCriteria.pageSize || 20,
            current_page: searchCriteria.currentPage || 1,
            total_pages: 0,
          },
        };
      }
    },
    "PRODUCT_LIST"
  );
};

/**
 * Get related products
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to related products
 */
export const getRelatedProducts = async (sku) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.RELATED_PRODUCTS(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetRelatedProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  related_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: { sku },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          return [];
        }

        return data.products.items[0].related_products || [];
      } catch (error) {
        console.error(`Error fetching related products for SKU ${sku}:`, error);
        return [];
      }
    },
    "PRODUCT_LIST"
  );
};

/**
 * Get cross-sell products
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to cross-sell products
 */
export const getCrossSellProducts = async (sku) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.CROSS_SELL(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetCrossSellProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  crosssell_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: { sku },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          return [];
        }

        return data.products.items[0].crosssell_products || [];
      } catch (error) {
        console.error(
          `Error fetching cross-sell products for SKU ${sku}:`,
          error
        );
        return [];
      }
    },
    "PRODUCT_LIST"
  );
};

/**
 * Get up-sell products
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to up-sell products
 */
export const getUpSellProducts = async (sku) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.UP_SELL(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetUpSellProducts($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  upsell_products {
                    ...ProductBasicFields
                  }
                }
              }
            }
            ${PRODUCT_BASIC_FRAGMENT}
          `,
          variables: { sku },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          return [];
        }

        return data.products.items[0].upsell_products || [];
      } catch (error) {
        console.error(`Error fetching up-sell products for SKU ${sku}:`, error);
        return [];
      }
    },
    "PRODUCT_LIST"
  );
};

/**
 * Get product reviews
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to product reviews
 */
export const getProductReviews = async (sku) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_REVIEWS(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductReviews($sku: String!) {
              products(filter: { sku: { eq: $sku } }) {
                items {
                  reviews {
                    items {
                      nickname
                      summary
                      text
                      average_rating
                      created_at
                    }
                  }
                }
              }
            }
          `,
          variables: { sku },
          fetchPolicy: "cache-first",
        });

        if (!data.products.items.length) {
          return [];
        }

        return data.products.items[0].reviews?.items || [];
      } catch (error) {
        console.error(`Error fetching reviews for SKU ${sku}:`, error);
        return [];
      }
    },
    "PRODUCT_REVIEWS"
  );
};

/**
 * Submit product review
 * @param {string} sku - Product SKU
 * @param {Object} reviewData - Review data
 * @returns {Promise} - Promise resolving to submission result
 */
export const submitProductReview = async (sku, reviewData) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation CreateProductReview(
          $sku: String!
          $nickname: String!
          $summary: String!
          $text: String!
          $ratings: [ProductReviewRatingInput!]!
        ) {
          createProductReview(
            input: {
              sku: $sku
              nickname: $nickname
              summary: $summary
              text: $text
              ratings: $ratings
            }
          ) {
            review {
              nickname
              summary
              text
              average_rating
              created_at
            }
          }
        }
      `,
      variables: {
        sku,
        nickname: reviewData.nickname,
        summary: reviewData.summary,
        text: reviewData.text,
        ratings: reviewData.ratings.map((rating) => ({
          id: rating.id,
          value_id: rating.value_id,
        })),
      },
    });

    return data.createProductReview.review;
  } catch (error) {
    console.error(`Error submitting review for SKU ${sku}:`, error);
    throw error;
  }
};

/**
 * Get product attributes
 * @param {string} attributeCode - Attribute code
 * @returns {Promise} - Promise resolving to attribute data
 */
export const getProductAttributes = async (attributeCode) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_ATTRIBUTES(attributeCode),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductAttributes($attributeCode: String!) {
              customAttributeMetadata(
                attributes: [
                  {
                    attribute_code: $attributeCode
                    entity_type: "catalog_product"
                  }
                ]
              ) {
                items {
                  attribute_code
                  attribute_type
                  entity_type
                  input_type
                  attribute_options {
                    value
                    label
                  }
                }
              }
            }
          `,
          variables: { attributeCode },
          fetchPolicy: "cache-first",
        });

        if (!data.customAttributeMetadata.items.length) {
          throw new Error(`Attribute ${attributeCode} not found`);
        }

        return data.customAttributeMetadata.items[0];
      } catch (error) {
        console.error(`Error fetching attribute ${attributeCode}:`, error);
        throw error;
      }
    },
    "PRODUCT_ATTRIBUTES"
  );
};

/**
 * Get product filters for category
 * @param {number} categoryId - Category ID
 * @returns {Promise} - Promise resolving to filter data
 */
export const getProductFilters = async (categoryId) => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_FILTERS(categoryId),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetProductFilters($categoryId: String!) {
              products(filter: { category_id: { eq: $categoryId } }) {
                aggregations {
                  attribute_code
                  count
                  label
                  options {
                    label
                    value
                    count
                  }
                }
              }
            }
          `,
          variables: { categoryId: String(categoryId) },
          fetchPolicy: "cache-first",
        });

        return data.products.aggregations || [];
      } catch (error) {
        console.error(
          `Error fetching filters for category ${categoryId}:`,
          error
        );
        return [];
      }
    },
    "PRODUCT_FILTERS"
  );
};

/**
 * Get best selling products
 * @param {number} pageSize - Number of products to fetch
 * @returns {Promise} - Promise resolving to best selling products
 */
// export const getBestSellingProducts = async (pageSize = 10) => {
//   return getCachedProductData(
//     PRODUCT_CACHE_KEYS.BEST_SELLING(pageSize),
//     async () => {
//       try {
//         const { data } = await apolloClient.query({
//           query: gql`
//             query GetBestSellingProducts($pageSize: Int!) {
//               products(
//                 filter: { bestseller: { eq: "1" } }
//                 pageSize: $pageSize
//                 sort: { position: ASC }
//               ) {
//                 total_count
//                 items {
//                   ...ProductBasicFields
//                 }
//               }
//             }
//             ${PRODUCT_BASIC_FRAGMENT}
//           `,
//           variables: { pageSize },
//           fetchPolicy: "cache-first",
//         });

//         return {
//           items: data.products.items || [],
//           total_count: data.products.total_count || 0,
//         };
//       } catch (error) {
//         console.error("Error fetching best selling products:", error);
//         return { items: [], total_count: 0 };
//       }
//     },
//     "PRODUCT_LIST"
//   );
// };

/**
 * Get product stock status
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to stock status
 */

/**
 * Get product stock status
 * @param {string} sku - Product SKU
 * @returns {Promise} - Promise resolving to stock status
 */
export const getProductStockStatus = async (sku) => {
  const PRODUCT_STOCK_QUERY = gql`
    query GetProductStockStatus($sku: String!) {
      products(filter: { sku: { eq: $sku } }) {
        items {
          sku
          stock_status
          only_x_left_in_stock
          quantity_and_stock_status {
            quantity
            is_in_stock
          }
        }
      }
    }
  `;

  return getCachedProductData(
    PRODUCT_CACHE_KEYS.PRODUCT_STOCK(sku),
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: PRODUCT_STOCK_QUERY,
          variables: { sku },
          fetchPolicy: "cache-first", // Ensure we get fresh data
        });

        // Extract the stock information from the response
        const product = data.products.items[0];
        if (!product) {
          throw new Error(`Product with SKU ${sku} not found`);
        }

        return {
          sku: product.sku,
          is_in_stock: product.quantity_and_stock_status.is_in_stock,
          quantity: product.quantity_and_stock_status.quantity,
          stock_status: product.stock_status,
          only_x_left_in_stock: product.only_x_left_in_stock,
        };
      } catch (error) {
        console.error(`Error fetching stock status for SKU ${sku}:`, error);
        throw error;
      }
    },
    "PRODUCT_STOCK"
  );
};

/**
 * Get global product aggregations (filters)
 * @returns {Promise} - Promise resolving to global aggregations data
 */
export const getGlobalProductAggregations = async () => {
  return getCachedProductData(
    PRODUCT_CACHE_KEYS.GLOBAL_PRODUCT_AGGREGATIONS, // Assuming this key will be added to productCacheUtils.js
    async () => {
      try {
        const { data } = await apolloClient.query({
          query: gql`
            query GetGlobalProductAggregations {
              products(filter: {}) {
                # Empty filter for global aggregations
                aggregations {
                  attribute_code
                  label
                  count # Total products for this aggregation
                  options {
                    label
                    value
                    count # Products matching this specific option
                  }
                }
              }
            }
          `,
          fetchPolicy: "cache-first",
        });

        if (!data.products || !data.products.aggregations) {
          console.warn("No aggregations found in global product data.");
          return [];
        }
        return data.products.aggregations;
      } catch (error) {
        console.error("Error fetching global product aggregations:", error);
        throw error; // Re-throw to be caught by context or calling function
      }
    },
    "GLOBAL_PRODUCT_AGGREGATIONS" // Cache type
  );
};

// Create the API object with all methods
const productApi = {
  getProducts,
  getProductById,
  getProductBySku,
  getProductByUrlKey,
  searchProducts,
  // getFeaturedProducts,
  // getNewProducts,
  getRelatedProducts,
  getCrossSellProducts,
  getUpSellProducts,
  getProductReviews,
  submitProductReview,
  getProductAttributes,
  getProductsByCategory,
  getProductFilters,
  getGlobalProductAggregations, // Added new function
  // getBestSellingProducts,
  getProductStockStatus,
};

// Export the API object
export default productApi;
