import { GraphQLApi } from './auth';
import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';

// GraphQL query fragments for reuse
const ORDER_FRAGMENT = `
  fragment OrderDetails on CustomerOrder {
    id
    order_number
    created_at
    grand_total
    status
    shipping_address {
      firstname
      lastname
      street
      city
      region
      postcode
      telephone
      country_code
    }
    billing_address {
      firstname
      lastname
      street
      city
      region
      postcode
      telephone
      country_code
    }
     
     shipping_method
    payment_methods {
      name
      type
      additional_data {
        name
        value
      }
    }
    total {
      subtotal {
        value
        currency
      }
      total_shipping {
        value
        currency
      }
      total_tax {
        value
        currency
      }
      discounts {
        amount {
          value
          currency
        }
        label
      }
    }
     items {
      id
      # Fetch product details including image via the nested 'product' object
      product {
        name
        sku
        url_key # Corrected: 'urk_key' to 'url_key'
        small_image {
          url
          label # It's good practice to get the label too
        }
      }
      # Removed redundant fields, as they are now under 'product'
      # product_name # Removed
      # product_sku # Removed
      # product_url_key # Removed

      product_sale_price {
        value
        currency
      }
      quantity_ordered
      product_type
      
      
    }
  }
`;

/**
 * Fetch all orders for the current customer from Magento using GraphQL
 * @returns {Promise<Array>} Array of customer orders
 */
export const getAllOrders = async () => {
  try {
    const query = `
      ${ORDER_FRAGMENT}
      query GetCustomerOrders {
        customer {
          orders {
            items {
              ...OrderDetails
            }
            total_count
          }
        }
      }
    `;

    const response = await GraphQLApi.post('/graphql', {
      query
    });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const items = response.data.data.customer?.orders?.items || [];
    let total_count = response.data.data.customer?.orders?.total_count || 0;

    // If API returns total_count as 0 but items are present, use items.length
    if (total_count === 0 && items.length > 0) {
      total_count = items.length;
    }

    return {
      items: items,
      total_count: total_count
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return {
      items: [],
      total_count: 0,
      error: error.message || 'Failed to fetch orders'
    };
  }
};
/**
 * Fetch a specific order by order number for the current customer
 * @param {string} order_number - The order number to fetch (e.g., "000000123")
 * @returns {Promise<Object|null>} Order object or null if not found
 */
export const getOrderById = async (order_number) => {
  if (!order_number) {
    console.error('Order number is required to fetch order details');
    return null;
  }

  try {
    const query = `
      ${ORDER_FRAGMENT}
      query GetCustomerOrderByNumber($filter: CustomerOrdersFilterInput!) {
        customer {
          orders(filter: $filter) {
            items {
              ...OrderDetails
              items {
                ... on BundleOrderItem {
                  bundle_options {
                    id
                    label
                    values {
                      id
                    
                      quantity
                      price {
                        value
                        currency
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      filter: {
        number: { eq: String(order_number) }
      }
    };

    const response = await GraphQLApi.post('/graphql', { query, variables });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const orders = response.data.data.customer?.orders?.items || [];
    return orders.length > 0 ? orders[0] : null;
  } catch (error) {
    console.error(`Error fetching order #${order_number}:`, error);
    return null;
  }
};
/**
 * Fetch customer orders with pagination
 * @param {number} currentPage - Page number (default: 1)
 * @param {number} pageSize - Number of orders per page (default: 20)
 * @returns {Promise<Object>} Object with orders and pagination info
 */
export const getCustomerOrdersWithPagination = async (currentPage = 1, pageSize = 20) => {
  try {
    const query = `
      ${ORDER_FRAGMENT}
      query GetCustomerOrdersWithPagination($currentPage: Int!, $pageSize: Int!) {
        customer {
          orders(
            currentPage: $currentPage
            pageSize: $pageSize
          ) {
            items {
              ...OrderDetails
            }
            total_count
            page_info {
              current_page
              page_size
              total_pages
            }
          }
        }
      }
    `;

    const response = await GraphQLApi.post('/graphql', {
      query,
      variables: { currentPage, pageSize }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return {
      items: response.data.data.customer?.orders?.items || [],
      total_count: response.data.data.customer?.orders?.total_count || 0,
      page_info: response.data.data.customer?.orders?.page_info || {
        current_page: currentPage,
        page_size: pageSize,
        total_pages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching paginated customer orders:', error);
    return {
      items: [],
      total_count: 0,
      page_info: {
        current_page: currentPage,
        page_size: pageSize,
        total_pages: 1
      },
      error: error.message || 'Failed to fetch orders'
    };
  }
};

/**
 * Fetch recent orders for the current customer
 * @param {number} limit - Maximum number of orders to return (default: 5)
 * @returns {Promise<Array>} Array of recent order objects
 */
export const getRecentOrders = async (limit = 5) => {
  try {
    const query = `
  ${ORDER_FRAGMENT}
  query GetRecentCustomerOrders($pageSize: Int!) {
    customer {
      orders(
        pageSize: $pageSize
        sort: { sort_field: CREATED_AT, sort_direction: DESC }
      ) {
        items {
          ...OrderDetails
          id
        }
      }
    }
  }
`;

    const response = await GraphQLApi.post('/graphql', {
      query,
      variables: { pageSize: limit }
    });


    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.customer?.orders?.items || [];
  } catch (error) {
    console.error('Error fetching recent customer orders:', error);
    return [];
  }
};

export default {
  getAllOrders,
  getOrderById,
  getCustomerOrdersWithPagination,
  getRecentOrders
};