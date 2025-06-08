import authService, { magentoApi } from './auth';

/**
 * Helper to check guest cart requirements
 */
const validateGuestCart = (cartId) => {
  if (!cartId) throw new Error('Cart ID is required for guest checkout');
};

/**
 * Get available shipping methods
 */
export const getShippingMethods = async (cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const endpoint = isLoggedIn
      ? '/carts/mine/shipping-methods'
      : `/guest-carts/${cartId}/shipping-methods`;

    const response = await magentoApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching shipping methods:', error.response?.data || error.message);
    throw new Error('Failed to fetch shipping methods');
  }
};

/**
 * Get available payment methods
 */
export const getPaymentMethods = async (cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const endpoint = isLoggedIn
      ? '/carts/mine/payment-methods'
      : `/guest-carts/${cartId}/payment-methods`;

    const response = await magentoApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching payment methods:', error.response?.data || error.message);
    throw new Error('Failed to fetch payment methods');
  }
};

/**
 * Set shipping information
 */
export const setShippingInformation = async (addressInfo, shippingMethod, cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const shippingAddress = {
      firstname: addressInfo.firstname,
      lastname: addressInfo.lastname,
      street: addressInfo.street,
      city: addressInfo.city,
      region: addressInfo.region,
      postcode: addressInfo.postcode,
      country_id: addressInfo.country_id,
      telephone: addressInfo.telephone,
      email: addressInfo.email,
      ...(addressInfo.region_id && { region_id: parseInt(addressInfo.region_id, 10) })
    };

    const billingAddress = addressInfo.same_as_billing
      ? { ...shippingAddress }
      : {
          firstname: addressInfo.billing_address.firstname,
          lastname: addressInfo.billing_address.lastname,
          street: addressInfo.billing_address.street,
          city: addressInfo.billing_address.city,
          region: addressInfo.billing_address.region,
          postcode: addressInfo.billing_address.postcode,
          country_id: addressInfo.billing_address.country_id,
          telephone: addressInfo.billing_address.telephone,
          email: addressInfo.billing_address.email,
          ...(addressInfo.billing_address.region_id && {
            region_id: parseInt(addressInfo.billing_address.region_id, 10)
          })
        };

    const shippingInfo = {
      addressInformation: {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_method_code: shippingMethod.method_code,
        shipping_carrier_code: shippingMethod.carrier_code
      }
    };

    const endpoint = isLoggedIn
      ? '/carts/mine/shipping-information'
      : `/guest-carts/${cartId}/shipping-information`;

    const response = await magentoApi.post(endpoint, shippingInfo);
    return response.data;
  } catch (error) {
    console.error('❌ Error setting shipping information:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to set shipping information');
  }
};

/**
 * Place order
 */
export const placeOrder = async (paymentInfo, cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const payload = {
      paymentMethod: {
        method: paymentInfo.method,
        ...(paymentInfo.additional_data && { additional_data: paymentInfo.additional_data })
      }
    };

    if (isLoggedIn) {
      try {
        const response = await magentoApi.post('/carts/mine/payment-information', payload);
        return response.data;
      } catch (err) {
        const fallback = await magentoApi.post('/carts/mine/order', payload);
        return fallback.data;
      }
    } else {
      return await placeGuestOrder(cartId, paymentInfo);
    }
  } catch (error) {
    console.error('❌ Error placing order:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to place order. Please try again.');
  }
};

/**
 * Place guest order
 */
export const placeGuestOrder = async (cartId, paymentInfo) => {
  try {
    validateGuestCart(cartId);
    if (!paymentInfo?.method) throw new Error('Payment method is required');
    if (!paymentInfo.email) throw new Error('Email is required for guest checkout');

    const payload = {
      paymentMethod: {
        method: paymentInfo.method,
        ...(paymentInfo.additional_data && { additional_data: paymentInfo.additional_data })
      },
      email: paymentInfo.email
    };

    const response = await magentoApi.put(`/guest-carts/${cartId}/order`, payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Guest order failed:', error.response?.data || error.message);
    let errorMessage = 'Failed to place order';

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Cart not found or expired.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }
    throw new Error(errorMessage);
  }
};

/**
 * Get countries
 */
export const getCountries = async () => {
  try {
    const response = await magentoApi.get('/directory/countries');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching countries:', error.response?.data || error.message);
    throw new Error('Failed to fetch countries list');
  }
};

/**
 * Estimate shipping methods
 */
export const estimateShippingMethods = async (address, cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const cleanAddress = {
      country_id: address.country_id,
      postcode: address.postcode,
      region: address.region,
      ...(address.region_id && { region_id: parseInt(address.region_id, 10) }),
      ...(address.city && { city: address.city })
    };

    const endpoint = isLoggedIn
      ? '/carts/mine/estimate-shipping-methods'
      : `/guest-carts/${cartId}/estimate-shipping-methods`;

    const response = await magentoApi.post(endpoint, { address: cleanAddress });
    return response.data;
  } catch (error) {
    console.error('❌ Error estimating shipping methods:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to estimate shipping methods');
  }
};

/**
 * Get cart totals
 */
export const getCartTotals = async (cartId = null) => {
  try {
    const isLoggedIn = authService.isAuthenticated();
    if (!isLoggedIn) validateGuestCart(cartId);

    const endpoint = isLoggedIn ? '/carts/mine/totals' : `/guest-carts/${cartId}/totals`;
    const response = await magentoApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching cart totals:', error.response?.data || error.message);
    throw new Error('Failed to fetch cart totals');
  }
};

export default {
  getShippingMethods,
  getPaymentMethods,
  setShippingInformation,
  placeOrder,
  placeGuestOrder,
  getCountries,
  estimateShippingMethods,
  getCartTotals
};
