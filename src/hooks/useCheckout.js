import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import checkoutApi from '../api/checkout';
import authService from '../api/auth';

/**
 * Custom hook for managing checkout process
 * @returns {Object} Checkout state and functions
 */
export const useCheckout = () => {
  const navigate = useNavigate();
  const { cart, cartItems, getCartItemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation
  
  // Checkout state
  const [shippingAddress, setShippingAddress] = useState({
    firstname: '',
    lastname: '',
    street: ['', ''],
    city: '',
    region: '',
    region_id: '',
    postcode: '',
    country_id: 'US',
    telephone: '',
    email: '',
    same_as_billing: true
  });
  
  const [billingAddress, setBillingAddress] = useState({
    firstname: '',
    lastname: '',
    street: ['', ''],
    city: '',
    region: '',
    region_id: '',
    postcode: '',
    country_id: 'US',
    telephone: '',
    email: ''
  });
  
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [countries, setCountries] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // Get guest cart ID if user is not logged in
  const guestCartId = !authService.isAuthenticated() ? localStorage.getItem('magento_guest_cart_id') : null;
  
  // Initialize checkout - fetch countries and prefill user data if logged in
  useEffect(() => {
    const initCheckout = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if cart is empty
        if (getCartItemCount() === 0) {
          navigate('/cart');
          return;
        }
        
        // Fetch countries list
        const countriesData = await checkoutApi.getCountries();
        setCountries(countriesData);
        
        // If user is logged in, prefill address with user data
        if (authService.isAuthenticated()) {
          const userInfo = authService.getUserInfo();
          if (userInfo) {
            // Prefill with user data if available
            const userAddress = userInfo.addresses && userInfo.addresses.length > 0 
              ? userInfo.addresses[0] 
              : null;
              
            if (userAddress) {
              const prefillAddress = {
                firstname: userInfo.firstname || '',
                lastname: userInfo.lastname || '',
                street: userAddress.street || ['', ''],
                city: userAddress.city || '',
                region: userAddress.region?.region || '',
                region_id: userAddress.region?.region_id || '',
                postcode: userAddress.postcode || '',
                country_id: userAddress.country_id || 'US',
                telephone: userAddress.telephone || '',
                email: userInfo.email || ''
              };
              
              setShippingAddress(prefillAddress);
              setBillingAddress(prefillAddress);
            } else {
              // Just prefill name and email
              setShippingAddress(prev => ({
                ...prev,
                firstname: userInfo.firstname || '',
                lastname: userInfo.lastname || '',
                email: userInfo.email || ''
              }));
              
              setBillingAddress(prev => ({
                ...prev,
                firstname: userInfo.firstname || '',
                lastname: userInfo.lastname || '',
                email: userInfo.email || ''
              }));
            }
          }
        }
        
        // Fetch cart totals for order summary
        const totals = await checkoutApi.getCartTotals(guestCartId);
        setOrderSummary(totals);
        
      } catch (err) {
        console.error('Error initializing checkout:', err);
        setError('Failed to initialize checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    initCheckout();
  }, [navigate, getCartItemCount, guestCartId]);
  
  // Estimate shipping methods when shipping address changes
  const estimateShippingMethods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Need at least country, postcode, and region for estimation
      if (!shippingAddress.country_id || !shippingAddress.postcode) {
        return;
      }
      
      const methods = await checkoutApi.estimateShippingMethods({
        country_id: shippingAddress.country_id,
        postcode: shippingAddress.postcode,
        region: shippingAddress.region,
        region_id: shippingAddress.region_id
      }, guestCartId);
      
      setShippingMethods(methods);
      
      // Select first method by default if available
      if (methods && methods.length > 0 && !selectedShippingMethod) {
        setSelectedShippingMethod(methods[0]);
      }
    } catch (err) {
      console.error('Error estimating shipping methods:', err);
      setError('Failed to estimate shipping methods. Please check your address.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const methods = await checkoutApi.getPaymentMethods(guestCartId);
      setPaymentMethods(methods);
      
      // Select first method by default if available
      if (methods && methods.length > 0 && !selectedPaymentMethod) {
        setSelectedPaymentMethod(methods[0]);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to fetch payment methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Set shipping information and move to payment step
  const saveShippingInformation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate shipping address
      const requiredFields = ['firstname', 'lastname', 'street', 'city', 'country_id', 'postcode', 'telephone', 'email'];
      const missingFields = requiredFields.filter(field => {
        if (field === 'street') {
          return !shippingAddress.street[0];
        }
        return !shippingAddress[field];
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }
      
      // Validate shipping method
      if (!selectedShippingMethod) {
        throw new Error('Please select a shipping method');
      }
      
      // Set shipping information
      await checkoutApi.setShippingInformation(
        shippingAddress.same_as_billing 
          ? shippingAddress 
          : { ...shippingAddress, billing_address: billingAddress },
        selectedShippingMethod,
        guestCartId
      );
      
      // Fetch payment methods
      await fetchPaymentMethods();
      
      // Update order summary
      const totals = await checkoutApi.getCartTotals(guestCartId);
      setOrderSummary(totals);
      
      // Move to payment step
      setStep(2);
    } catch (err) {
      console.error('Error saving shipping information:', err);
      setError(err.message || 'Failed to save shipping information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Place order
  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate payment method
      if (!selectedPaymentMethod) {
        throw new Error('Please select a payment method');
      }
      
      // Prepare payment information
      const paymentInfo = {
        method: selectedPaymentMethod.code,
        email: shippingAddress.email
      };
      
      // Place the order
      const orderResult = await checkoutApi.placeOrder(paymentInfo, guestCartId);
      
      // Save order ID
      setOrderId(orderResult);
      
      // Clear cart after successful order
      await clearCart();
      
      // Move to confirmation step
      setStep(4);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle shipping address change
  const handleShippingAddressChange = (field, value) => {
    setShippingAddress(prev => {
      const updated = { ...prev };
      
      // Handle street array
      if (field.startsWith('street[')) {
        const index = parseInt(field.match(/\[(\d+)\]/)[1]);
        updated.street = [...updated.street];
        updated.street[index] = value;
      } else {
        updated[field] = value;
      }
      
      // If same as billing, update billing address too
      if (updated.same_as_billing) {
        setBillingAddress(updated);
      }
      
      return updated;
    });
  };
  
  // Handle billing address change
  const handleBillingAddressChange = (field, value) => {
    setBillingAddress(prev => {
      const updated = { ...prev };
      
      // Handle street array
      if (field.startsWith('street[')) {
        const index = parseInt(field.match(/\[(\d+)\]/)[1]);
        updated.street = [...updated.street];
        updated.street[index] = value;
      } else {
        updated[field] = value;
      }
      
      return updated;
    });
  };
  
  // Toggle same as billing
  const toggleSameAsBilling = () => {
    setShippingAddress(prev => {
      const updated = { ...prev, same_as_billing: !prev.same_as_billing };
      
      // If toggling to true, update billing address to match shipping
      if (updated.same_as_billing) {
        setBillingAddress(updated);
      }
      
      return updated;
    });
  };
  
  // Go to next step
  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };
  
  // Go to previous step
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  return {
    // State
    loading,
    error,
    step,
    shippingAddress,
    billingAddress,
    shippingMethods,
    selectedShippingMethod,
    paymentMethods,
    selectedPaymentMethod,
    countries,
    orderSummary,
    orderId,
    cartItems,
    
    // Actions
    setShippingAddress,
    setBillingAddress,
    setSelectedShippingMethod,
    setSelectedPaymentMethod,
    handleShippingAddressChange,
    handleBillingAddressChange,
    toggleSameAsBilling,
    estimateShippingMethods,
    saveShippingInformation,
    placeOrder,
    nextStep,
    prevStep,
    setError
  };
};