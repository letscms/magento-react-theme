import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import checkoutApi from "../../api/checkout";
import authService from "../../api/auth";

// Import section components
import AddressSection from "./AddressSection";
import ShippingSection from "./ShippingSection";
import PaymentSection from "./PaymentSection";
import ReviewSection from "./ReviewSection";
import ConfirmationSection from "./ConfirmationSection";
import OrderSummary from "./OrderSummary";
import LoadingSpinner from "../../utils/Loader"; // Assuming this is the correct path

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
    review: false,
  });

  const [sectionCompleted, setSectionCompleted] = useState({
    address: false,
    shipping: false,
    payment: false,
    review: false,
  });

  const [sectionLoading, setSectionLoading] = useState({
    address: false,
    shipping: false,
    payment: false,
    review: false,
  });

  // Checkout data states
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    street: ["", ""],
    city: "",
    region: "",
    region_id: "",
    postcode: "",
    country_id: "US", // Default or fetch from config
    telephone: "",
    email: "",
    save_in_address_book: true, // Added for AddressSection
    same_as_billing: true,
  });

  const [billingAddress, setBillingAddress] = useState({
    firstname: "",
    lastname: "",
    street: ["", ""],
    city: "",
    region: "",
    region_id: "",
    postcode: "",
    country_id: "US", // Default or fetch from config
    telephone: "",
    email: "",
  });

  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [countries, setCountries] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const isGuest = !authService.isAuthenticated();
  const guestCartId = isGuest
    ? localStorage.getItem("magento_guest_cart_id")
    : null;

  useEffect(() => {
    const initCheckout = async () => {
      setLoading(true);
      setError(null);
      try {
        if (getCartItemCount() === 0 && !orderId) { // Don't redirect if order was just placed
          navigate("/cart");
          return;
        }
        const countriesData = await checkoutApi.getCountries();
        setCountries(countriesData);

        if (authService.isAuthenticated()) {
          const userInfo = authService.getUserInfo();
          if (userInfo) {
            const userDefaultShipping = userInfo.addresses?.find(addr => addr.default_shipping);
            const userAddress = userDefaultShipping || (userInfo.addresses && userInfo.addresses.length > 0 ? userInfo.addresses[0] : null);

            const baseAddress = {
              firstname: userInfo.firstname || "",
              lastname: userInfo.lastname || "",
              email: userInfo.email || "",
              telephone: userAddress?.telephone || "", // Prioritize address telephone
              street: userAddress?.street || ["", ""],
              city: userAddress?.city || "",
              region: userAddress?.region?.region || (typeof userAddress?.region === 'string' ? userAddress.region : "") || "",
              region_id: userAddress?.region?.region_id || userAddress?.region_id || "",
              postcode: userAddress?.postcode || "",
              country_id: userAddress?.country_id || "US",
              same_as_billing: true,
              save_in_address_book: true,
            };
            setShippingAddress(baseAddress);
            setBillingAddress(baseAddress); // Initially same
          }
        }
        if (isGuest && !guestCartId && !orderId) {
          throw new Error("No guest cart ID found. Please add items to your cart first.");
        }
        if (cartItems.length > 0) { // Only fetch totals if cart has items or order not yet placed
            const totals = await checkoutApi.getCartTotals(guestCartId);
            setOrderSummary(totals);
        }

      } catch (err) {
        console.error("Error initializing checkout:", err);
        setError(err.message || "Failed to initialize checkout. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [navigate, getCartItemCount, guestCartId, isGuest, orderId, cartItems.length]); // Added orderId and cartItems.length

  const toggleSection = useCallback((section) => {
    setSectionExpanded((prevExpanded) => {
      const newExpandedState = { address: false, shipping: false, payment: false, review: false };
      if (
        (section === "address") ||
        (section === "shipping" && sectionCompleted.address) ||
        (section === "payment" && sectionCompleted.shipping) ||
        (section === "review" && sectionCompleted.payment)
      ) {
        newExpandedState[section] = !prevExpanded[section];
      } else if (prevExpanded[section]) { // Allow closing a section even if prerequisites for next aren't met
        newExpandedState[section] = false;
      } else {
        return prevExpanded; // If trying to open a section whose prerequisites are not met, do nothing
      }
      return newExpandedState;
    });
  }, [sectionCompleted]);

  const handleShippingAddressChange = useCallback((fieldOrFullAddress, value, isFullObject = false) => {
    setShippingAddress((prev) => {
      let updated;
      if (isFullObject && typeof fieldOrFullAddress === 'object' && fieldOrFullAddress !== null) {
        updated = { ...prev, ...fieldOrFullAddress };
      } else {
         updated = { ...prev, [fieldOrFullAddress]: value };
         if (fieldOrFullAddress === "region_id" && value && !isNaN(value)) {
            updated[fieldOrFullAddress] = parseInt(value, 10);
         } else if (fieldOrFullAddress === "region_id" && (value === "" || value === null)) {
            updated.region_id = ""; // Explicitly clear if emptied
            updated.region = ""; // Also clear text region if ID is cleared
         }
      }
      if (updated.same_as_billing) {
        const newBillingAddress = { ...updated };
        delete newBillingAddress.same_as_billing;
        delete newBillingAddress.save_in_address_book; // Not relevant for billing copy
        setBillingAddress(newBillingAddress);
      }
      return updated;
    });
  }, []); // setBillingAddress is stable

  const handleBillingAddressChange = useCallback((fieldOrFullAddress, value, isFullObject = false) => {
    setBillingAddress((prev) => {
      if (isFullObject && typeof fieldOrFullAddress === 'object' && fieldOrFullAddress !== null) {
        return { ...prev, ...fieldOrFullAddress };
      }
      const updated = { ...prev, [fieldOrFullAddress]: value };
      if (fieldOrFullAddress === "region_id" && value && !isNaN(value)) {
        updated[fieldOrFullAddress] = parseInt(value, 10);
      } else if (fieldOrFullAddress === "region_id" && (value === "" || value === null)) {
        updated.region_id = "";
        updated.region = "";
      }
      return updated;
    });
  }, []);

  const toggleSameAsBilling = useCallback(() => {
    setShippingAddress((prevShipping) => {
      const newSameAsBilling = !prevShipping.same_as_billing;
      const updatedShipping = { ...prevShipping, same_as_billing: newSameAsBilling };
      if (newSameAsBilling) {
        const newBilling = { ...updatedShipping };
        delete newBilling.same_as_billing;
        delete newBilling.save_in_address_book;
        setBillingAddress(newBilling);
      }
      return updatedShipping;
    });
  }, []); // setBillingAddress is stable

  const saveShippingAddress = useCallback(async () => {
    setSectionLoading((prev) => ({ ...prev, address: true }));
    setError(null);
    try {
      const requiredFields = ["firstname", "lastname", "street", "city", "country_id", "postcode", "telephone", "email"];
      const missingFields = requiredFields.filter((field) =>
        field === "street" ? !shippingAddress.street[0] : !shippingAddress[field]
      );
      if (missingFields.length > 0) throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) throw new Error("Please enter a valid email address.");

      const estimateAddress = {
        country_id: shippingAddress.country_id,
        postcode: shippingAddress.postcode,
        region: shippingAddress.region,
        ...(shippingAddress.region_id && !isNaN(shippingAddress.region_id) && shippingAddress.region_id !== "" && { region_id: parseInt(shippingAddress.region_id, 10) }),
      };

      const methods = await checkoutApi.estimateShippingMethods(estimateAddress, guestCartId);
      setShippingMethods(methods || []); // Ensure it's an array
      if (methods && methods.length > 0) {
        setSelectedShippingMethod(methods[0]);
      } else {
        setSelectedShippingMethod(null); // No methods available
        throw new Error("No shipping methods available for the provided address.");
      }

      setSectionCompleted((prev) => ({ ...prev, address: true }));
      setSectionExpanded((prev) => ({ ...prev, address: false, shipping: true, payment: false, review: false }));
    } catch (err) {
      console.error("Error saving shipping address:", err);
      setError(err.message || "Failed to save shipping information. Please try again.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, address: false }));
    }
  }, [shippingAddress, guestCartId]);

  const saveShippingMethod = useCallback(async () => {
    setSectionLoading((prev) => ({ ...prev, shipping: true }));
    setError(null);
    try {
      if (!selectedShippingMethod) throw new Error("Please select a shipping method.");

      await checkoutApi.setShippingInformation(
        shippingAddress.same_as_billing ? shippingAddress : { ...shippingAddress, billing_address: billingAddress },
        selectedShippingMethod,
        guestCartId
      );

      const paymentMethodsData = await checkoutApi.getPaymentMethods(guestCartId);
      setPaymentMethods(paymentMethodsData || []); // Ensure it's an array
      if (paymentMethodsData && paymentMethodsData.length > 0) {
        setSelectedPaymentMethod(paymentMethodsData[0]);
      } else {
        setSelectedPaymentMethod(null);
        // Potentially throw error or handle no payment methods
      }

      const totals = await checkoutApi.getCartTotals(guestCartId);
      setOrderSummary(totals);

      setSectionCompleted((prev) => ({ ...prev, shipping: true }));
      setSectionExpanded((prev) => ({ ...prev, address: false, shipping: false, payment: true, review: false }));
    } catch (err) {
      console.error("Error saving shipping method:", err);
      setError(err.message || "Failed to save shipping method. Please try again.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, shipping: false }));
    }
  }, [shippingAddress, billingAddress, selectedShippingMethod, guestCartId]);

  const savePaymentMethod = useCallback(async () => {
    setSectionLoading((prev) => ({ ...prev, payment: true }));
    setError(null);
    try {
      if (!selectedPaymentMethod) throw new Error("Please select a payment method.");
      setSectionCompleted((prev) => ({ ...prev, payment: true }));
      setSectionExpanded((prev) => ({ ...prev, address: false, shipping: false, payment: false, review: true }));
    } catch (err) {
      console.error("Error saving payment method:", err);
      setError(err.message || "Failed to save payment method. Please try again.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, payment: false }));
    }
  }, [selectedPaymentMethod]);

  const placeOrder = useCallback(async () => {
    setSectionLoading((prev) => ({ ...prev, review: true }));
    setError(null);
    try {
      if (!selectedPaymentMethod) throw new Error("Payment method not selected.");
      const paymentInfo = { method: selectedPaymentMethod.code, email: shippingAddress.email };
      const orderResult = await checkoutApi.placeOrder(paymentInfo, guestCartId);
      setOrderId(orderResult); // This is typically an order ID string
      await clearCart();
      setSectionCompleted((prev) => ({ ...prev, review: true, address: true, shipping: true, payment: true })); // Mark all as complete
      setSectionExpanded({ address: false, shipping: false, payment: false, review: false }); // Collapse all
      // Navigate to a success page or show confirmation inline handled by orderId state change
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, review: false }));
    }
  }, [selectedPaymentMethod, shippingAddress.email, guestCartId, clearCart]);


  if (loading && !orderId) { // Show main loader only during init and if no order placed yet
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {orderId ? (
            <ConfirmationSection orderId={orderId} />
          ) : (
            <>
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
                sectionLoading={sectionLoading.address} // Pass specific loading state
              />

              <ShippingSection
                shippingMethods={shippingMethods}
                selectedShippingMethod={selectedShippingMethod}
                setSelectedShippingMethod={setSelectedShippingMethod} // Pass setter directly
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                saveShippingMethod={saveShippingMethod}
                sectionLoading={sectionLoading.shipping}
              />

              <PaymentSection
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod} // Pass setter directly
                sectionCompleted={sectionCompleted}
                sectionExpanded={sectionExpanded}
                toggleSection={toggleSection}
                savePaymentMethod={savePaymentMethod}
                sectionLoading={sectionLoading.payment}
              />

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
                sectionLoading={sectionLoading.review}
                onCouponApplied={async () => {
                  const totals = await checkoutApi.getCartTotals(guestCartId);
                  setOrderSummary(totals);
                }}
                onCouponRemoved={async () => {
                  const totals = await checkoutApi.getCartTotals(guestCartId);
                  setOrderSummary(totals);
                }}
              />
            </>
          )}
        </div>

        {!orderId && cartItems.length > 0 && ( // Show summary if no order placed and cart has items
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
