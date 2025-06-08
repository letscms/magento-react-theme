import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import checkoutApi from '../../api/checkout';
import authService from '../../api/auth';

// Import section components
import AddressSection from './AddressSection';
import ShippingSection from './ShippingSection';
import PaymentSection from './PaymentSection';
import ReviewSection from './ReviewSection';
import ConfirmationSection from './ConfirmationSection';
import OrderSummary from './OrderSummary';
import LoadingSpinner from '../../utils/Loader.jsx';

const OnePageCheckout = () => {
  const navigate = useNavigate();
  const { cart, cartItems, getCartItemCount, clearCart } = useCart();
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Section states
  const [sectionExpanded, setSectionExpanded] = useState({
    address: true,
    shipping: false,
    payment: false,
    review: false
  });
  
  const [sectionCompleted, setSectionCompleted] = useState({
    address: false,
    shipping: false,
    payment: false,
    review: false
  });
  
  const [sectionLoading, setSectionLoading] = useState({
    address: false,
    shipping: false,
    payment: false,
    review: false
  });
  
  // Checkout data states
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
                email: userInfo.email || '',
                same_as_billing: true
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
  
  // Toggle section expansion
  const toggleSection = (section) => {
    // Only allow toggling if the previous sections are completed
    if (section === 'address' || 
        (section === 'shipping' && sectionCompleted.address) ||
        (section === 'payment' && sectionCompleted.shipping) ||
        (section === 'review' && sectionCompleted.payment)) {
      
      setSectionExpanded(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
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
  
  // Save shipping address and fetch shipping methods
  const saveShippingAddress = async () => {
    setSectionLoading(prev => ({ ...prev, address: true }));
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
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(shippingAddress.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Estimate shipping methods
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
      
      // Mark address section as completed
      setSectionCompleted(prev => ({ ...prev, address: true }));
      
      // Expand shipping section
      setSectionExpanded(prev => ({
        ...prev,
        address: false,
        shipping: true
      }));
      
    } catch (err) {
      console.error('Error saving shipping address:', err);
      setError(err.message || 'Failed to save shipping information. Please try again.');
    } finally {
      setSectionLoading(prev => ({ ...prev, address: false }));
    }
  };
  
  // Save shipping method and fetch payment methods
  const saveShippingMethod = async () => {
    setSectionLoading(prev => ({ ...prev, shipping: true }));
    setError(null);
    
    try {
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
      const methods = await checkoutApi.getPaymentMethods(guestCartId);
      setPaymentMethods(methods);
      
      // Select first method by default if available
      if (methods && methods.length > 0 && !selectedPaymentMethod) {
        setSelectedPaymentMethod(methods[0]);
      }
      
      // Update order summary
      const totals = await checkoutApi.getCartTotals(guestCartId);
      setOrderSummary(totals);
      
      // Mark shipping section as completed
      setSectionCompleted(prev => ({ ...prev, shipping: true }));
      
      // Expand payment section
      setSectionExpanded(prev => ({
        ...prev,
        shipping: false,
        payment: true
      }));
      
    } catch (err) {
      console.error('Error saving shipping method:', err);
      setError(err.message || 'Failed to save shipping method. Please try again.');
    } finally {
      setSectionLoading(prev => ({ ...prev, shipping: false }));
    }
  };
  
  // Save payment method and proceed to review
  const savePaymentMethod = async () => {
    setSectionLoading(prev => ({ ...prev, payment: true }));
    setError(null);
    
    try {
      // Validate payment method
      if (!selectedPaymentMethod) {
        throw new Error('Please select a payment method');
      }
      
      // Mark payment section as completed
      setSectionCompleted(prev => ({ ...prev, payment: true }));
      
      // Expand review section
      setSectionExpanded(prev => ({
        ...prev,
        payment: false,
        review: true
      }));
      
    } catch (err) {
      console.error('Error saving payment method:', err);
      setError(err.message || 'Failed to save payment method. Please try again.');
    } finally {
      setSectionLoading(prev => ({ ...prev, payment: false }));
    }
  };
  
  // Place order
  const placeOrder = async () => {
    setSectionLoading(prev => ({ ...prev, review: true }));
    setError(null);
    
    try {
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
      
      // Mark review section as completed
      setSectionCompleted(prev => ({ ...prev, review: true }));
      
      // Collapse all sections
      setSectionExpanded({
        address: false,
        shipping: false,
        payment: false,
        review: false
      });
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSectionLoading(prev => ({ ...prev, review: false }));
    }
  };
  
  // Render loading state
  if (loading && !cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="lg:w-2/3">
          {/* Order Confirmation (if order is placed) */}
          {orderId ? (
            <ConfirmationSection orderId={orderId} />
          ) : (
            <>
              {/* Address Section */}
              <AddressSection 
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                handleShippingAddressChange={handleShippingAddressChange}
                handleBillingAddressChange={handleBillingAddressChange}
                toggleSameAsBilling={toggleSameAsBilling}
                countries={countries}
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                saveShippingAddress={saveShippingAddress}
                sectionLoading={sectionLoading}
              />
              
              {/* Shipping Method Section */}
              <ShippingSection 
                shippingMethods={shippingMethods}
                selectedShippingMethod={selectedShippingMethod}
                setSelectedShippingMethod={setSelectedShippingMethod}
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                saveShippingMethod={saveShippingMethod}
                sectionLoading={sectionLoading}
              />
              
              {/* Payment Method Section */}
              <PaymentSection 
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                savePaymentMethod={savePaymentMethod}
                sectionLoading={sectionLoading}
              />
              
              {/* Review Section */}
              <ReviewSection 
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                selectedShippingMethod={selectedShippingMethod}
                selectedPaymentMethod={selectedPaymentMethod}
                cartItems={cartItems}
                orderSummary={orderSummary}
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                placeOrder={placeOrder}
                sectionLoading={sectionLoading}
              />
            </>
          )}
        </div>
        
        {/* Order Summary */}
        {!orderId && (
          <div className="lg:w-1/3">
            <OrderSummary 
              cartItems={cartItems}
              orderSummary={orderSummary}
              selectedShippingMethod={selectedShippingMethod}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageCheckout;