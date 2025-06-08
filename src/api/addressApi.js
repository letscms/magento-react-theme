/**
 * Address API service for Magento-style address operations
 * This service handles fetching, creating, updating, and deleting customer addresses
 */

import {
  AUTH_TOKEN_KEY,
  USER_INFO_KEY,
  CART_KEY,
  MAGENTO_GUEST_CART_ID,
} from "../constants/storageKeys";

const API_BASE_URL = import.meta.env.VITE_MAGENTO_API_URL;


// Helper function to get the auth token and headers
const getAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error ${response.status}`
    }));
    throw new Error(errorData.message || `HTTP error ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch current customer data
 * @returns {Promise<Object>} Customer data object
 */
const getCurrentCustomer = async () => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${API_BASE_URL}/customers/me`, {
    method: 'GET',
    headers
  });

  return handleApiResponse(response);
};

/**
 * Fetches all addresses for the currently logged-in customer.
 * @returns {Promise<Array>} A promise that resolves to an array of addresses.
 */
export const getAddresses = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'GET',
      headers
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error in getAddresses:', error);
    throw error;
  }
};

/**
 * Fetch a single address by ID
 * @param {number} addressId - The ID of the address to fetch
 * @returns {Promise<Object>} Address object
 */
export const fetchAddress = async (addressId) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/customers/me/addresses/${addressId}`, {
      method: 'GET',
      headers
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching address ${addressId}:`, error);
    throw error;
  }
};

/**
 * Helper function to prepare address data for Magento API
 * @param {Object} addressData - Raw address data from form
 * @returns {Object} Prepared address data for Magento API
 */
export function prepareAddressData(addressData) {
  const prepared = { ...addressData };

  // Ensure street is always an array and filter out empty lines
  if (prepared.street && !Array.isArray(prepared.street)) {
    prepared.street = [prepared.street];
  } else if (Array.isArray(prepared.street)) {
    prepared.street = prepared.street.filter(line => line && line.trim() !== '');
  }

  // Handle region & region_id properly
  if (prepared.region_input && !prepared.region) {
    prepared.region = {
      region: prepared.region_input
    };
  }

  // If region_id is valid (not empty string/null/undefined), parse it
  if (prepared.region_id !== undefined && prepared.region_id !== "" && prepared.region_id !== null) {
    if (!prepared.region) prepared.region = {};
    prepared.region.region_id = parseInt(prepared.region_id, 10);
  }

  // Remove unused fields
  delete prepared.region_input;
  delete prepared.region_id;
  delete prepared.customerId;
  delete prepared.email;

  // Default values if missing
  if (!prepared.telephone) prepared.telephone = '';
  if (!prepared.country_id) prepared.country_id = 'US';

  return prepared;
}



/**
 * Adds a new address for the currently logged-in customer.
 * @param {Object} addressData - The address data to add.
 *   Example: {
 *     region: { region_code: 'NY', region: 'New York', region_id: 43 },
 *     country_id: 'US',
 *     street: ['123 Main St'],
 *     telephone: '555-1234',
 *     postcode: '10001',
 *     city: 'New York',
 *     firstname: 'John',
 *     lastname: 'Doe',
 *     default_shipping: false,
 *     default_billing: false
 *   }
 * @returns {Promise<Object>} A promise that resolves to the newly created address.
 */
export const addAddress = async (addressData) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    // Step 1: Get current customer
    const customerResponse = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'GET',
      headers,
    });

    if (!customerResponse.ok) {
      throw new Error('Failed to fetch customer details.');
    }

    const customer = await customerResponse.json();
    // Step 2: Add new address to existing list
    const preparedAddress = prepareAddressData(addressData); 

    // Step 3: Create updated customer object, ensuring email is preserved
    const updatedCustomer = {
      id: customer.id,
      email: customer.email,
      firstname: customer.firstname,
      lastname: customer.lastname,
      addresses: [...(customer.addresses || []), preparedAddress],
    };
    // Step 4: Update customer with new address
    const updateResponse = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customer: updatedCustomer }), // ← fix applied
    });


    return handleApiResponse(updateResponse);
  } catch (error) {
    console.error('Error in addAddress:', error);
    throw error;
  }
};


/**
 * Updates an existing address for the currently logged-in customer.
 * @param {Object} addressData - The address data to update. Must include 'id'.
 * @returns {Promise<Object>} A promise that resolves to the updated address.
 */
export const updateAddress = async (addressData) => {
  try {
    // Validate address ID
    if (!addressData.id) {
      throw new Error('Address ID is required for updating.');
    }

    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    // Step 1: Get current customer
    const customerResponse = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'GET',
      headers,
    });

    if (!customerResponse.ok) {
      throw new Error('Failed to fetch customer details.');
    }

    const customer = await customerResponse.json();
    
    // Step 2: Find and update the address
    const addressId = addressData.id;
    
    // Check if the address exists in the customer's addresses
    const addressExists = customer.addresses && 
                         customer.addresses.some(address => address.id === addressId);
    
    if (!addressExists) {
      throw new Error(`Address with ID ${addressId} not found.`);
    }

    const updatedAddresses = customer.addresses.map(address => {
      if (address.id === addressId) {
        return {
          ...address,
          ...prepareAddressData(addressData)
        };
      }
      return address;
    });

    // Step 3: Create updated customer object, ensuring email is preserved
    const updatedCustomer = {
      ...customer,
      addresses: updatedAddresses
    };
    // Step 4: Update customer with modified address
    const updateResponse = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customer: updatedCustomer }),
    });

    return handleApiResponse(updateResponse);
  } catch (error) {
    console.error('Error in updateAddress:', error);
    throw error;
  }
};

/**
 * Deletes an address for the currently logged-in customer.
 * @param {number} addressId - The ID of the address to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful.
 */
export const deleteAddress = async (addressId) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    // First, get the current customer data
    const customer = await getCurrentCustomer();
    
    // Check if the address exists
    const addressExists = customer.addresses && 
                         customer.addresses.some(address => address.id === addressId);
    
    if (!addressExists) {
      throw new Error(`Address with ID ${addressId} not found.`);
    }
    
    // Get the address we're about to delete
    const addressToDelete = customer.addresses.find(address => address.id === addressId);
    
    // Filter out the address to delete
    const updatedAddresses = customer.addresses.filter(address => address.id !== addressId);
    
    // Create updated customer object
    const updatedCustomer = {
      ...customer,
      addresses: updatedAddresses
    };
    
    // If we're deleting a default address, we need to handle that specially
    if (addressToDelete.default_billing || addressToDelete.default_shipping) {
      // If there are other addresses, set the first one as default
      if (updatedAddresses.length > 0) {
        if (addressToDelete.default_billing) {
          updatedCustomer.default_billing = updatedAddresses[0].id;
        }
        if (addressToDelete.default_shipping) {
          updatedCustomer.default_shipping = updatedAddresses[0].id;
        }
      } else {
        // If no addresses left, remove the default address properties
        delete updatedCustomer.default_billing;
        delete updatedCustomer.default_shipping;
      }
    }
    
    // Update the customer with the address removed
    const response = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customer: updatedCustomer }),
    });

    await handleApiResponse(response);
    return true;
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    throw error;
  }
};

/**
 * Set an address as the default shipping or billing address
 * @param {number} addressId - The ID of the address to set as default
 * @param {string} type - Either 'shipping' or 'billing'
 * @returns {Promise<Object>} Result of the operation
 */
export const setDefaultAddress = async (addressId, type) => {
  if (type !== 'shipping' && type !== 'billing') {
    throw new Error('Type must be either "shipping" or "billing"');
  }

  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error('Authentication token not found.');
  }

  try {
    // Step 1: Get current customer data
    const customer = await getCurrentCustomer();

    // Step 2: Verify the address exists in the customer's addresses
    const targetAddressExists = customer.addresses &&
                               Array.isArray(customer.addresses) &&
                               customer.addresses.some(addr => addr.id === addressId);

    if (!targetAddressExists) {
      console.error(`Address with ID ${addressId} not found in customer's addresses. Cannot set as default.`);
      throw new Error(`Address with ID ${addressId} not found in customer's addresses.`);
    }

    // Step 3: Prepare the updated customer object
    const updatedCustomer = { ...customer };

    // Step 4: Update the default_shipping/default_billing ID on the customer object
    // Magento expects these IDs as strings in the PUT request.
    if (type === 'shipping') {
      updatedCustomer.default_shipping = String(addressId);
    } else { // type === 'billing'
      updatedCustomer.default_billing = String(addressId);
    }

    // Step 5: Update the default_shipping/default_billing flags on individual addresses
    if (updatedCustomer.addresses && Array.isArray(updatedCustomer.addresses)) {
      updatedCustomer.addresses = updatedCustomer.addresses.map(addr => {
        const isTargetAddress = addr.id === addressId;
        let newDefaultShipping = addr.default_shipping;
        let newDefaultBilling = addr.default_billing;

        if (type === 'shipping') {
          newDefaultShipping = isTargetAddress;
        } else { // type === 'billing'
          newDefaultBilling = isTargetAddress;
        }
        return {
          ...addr,
          default_shipping: newDefaultShipping,
          default_billing: newDefaultBilling,
        };
      });
    }
    
    // Step 6: Update the customer on the server
    const response = await fetch(`${API_BASE_URL}/customers/me`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json' // Ensure Content-Type is set
      },
      body: JSON.stringify({ customer: updatedCustomer }),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error(`Error setting default ${type} address for ID ${addressId}:`, error);
    throw error;
  }
};

/**
 * Validate address data against Magento API
 * @param {Object} addressData - The address data to validate
 * @returns {Promise<Object>} Validation results
 */
export const validateAddress = async (addressData) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    const preparedAddress = prepareAddressData(addressData);

    const response = await fetch(`${API_BASE_URL}/customers/addresses/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ address: preparedAddress }),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error validating address:', error);
    throw error;
  }
};
/**
 * Fetch the list of countries with code and name (via REST API)
 * @returns {Promise<Array>} Array of countries [{ id, full_name_english }]
 */
export const fetchCountries = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/directory/countries`, {
      method: 'GET',
      headers,
    });

    const result = await handleApiResponse(response);

    // Magento REST API returns an array of country objects with 'id' and 'full_name_english'
    return result;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

/**
 * Fetch regions (states) for a given country ID (via REST API)
 * @param {string} countryId - Country code (like 'US', 'IN')
 * @returns {Promise<Array>} Array of regions [{ id, code, name }]
 */
export const fetchRegionsByCountry = async (countryId) => {

  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/directory/countries/${countryId}`, {
      method: 'GET',
      headers,
    });

    const result = await handleApiResponse(response);

    // Check if available regions exist
    if (!result.available_regions) {
      console.warn(`No regions found for country ${countryId}`);
      return [];
    }
    return result.available_regions;
  } catch (error) {
    console.error(`Error fetching regions for country ${countryId}:`, error);
    throw error;
  }
};

// Example of how Magento expects region data (can be ID or code)
// "region": {
//   "region_code": "NY",
//   "region": "New York",
//   "region_id": 43 // region_id is preferred if known
// },
// "country_id": "US",
// "street": [
//   "123 Oak Ave"
// ],
// "telephone": "555-555-5555",
// "postcode": "10577",
// "city": "Purchase",
// "firstname": "Jane",
// "lastname": "Doe",
// "default_shipping": true, // optional
// "default_billing": true // optional
