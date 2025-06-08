import React, { useState, memo, useCallback } from "react"; // Added memo and useCallback
import { formatPrice } from "../../utils/formatters";
import LoadingSpinner from "../../utils/Loader"; // Assuming this is the correct path
import { applyCoupon, removeCoupon } from "../../api/cart";

const ReviewSectionInternal = ({
  shippingAddress,
  billingAddress,
  selectedShippingMethod,
  selectedPaymentMethod,
  cartItems,
  orderSummary,
  sectionCompleted,
  sectionExpanded,
  toggleSection,
  placeOrder,
  sectionLoading, // This prop was in the original, ensure it's passed from OnePageCheckout
  onCouponApplied,
  onCouponRemoved, // Added for consistency if needed, or can use onCouponApplied for both
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const formatAddressDisplay = useCallback((address) => { // Renamed to avoid conflict if formatAddress is imported
    if (!address) return "No address provided";
    const parts = [
      `${address.firstname} ${address.lastname}`,
      address.street.filter(Boolean).join(", "), // Join street lines if both exist
      `${address.city}, ${address.region || ""} ${address.postcode}`.replace(" ,", ",").trim(), // Clean up spacing
      address.country_id,
      address.telephone ? `Tel: ${address.telephone}` : null,
    ].filter(Boolean);
    return parts.join("; "); // Use a different separator for clarity
  }, []);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const result = await applyCoupon(couponCode);
      if (result.success) {
        setCouponSuccess("Coupon applied successfully!");
        setTimeout(() => setCouponSuccess(""), 3000);
        setCouponCode("");
        if (onCouponApplied) await onCouponApplied();
      } else {
        setCouponError(result.message || "Failed to apply coupon.");
      }
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      setCouponError(err.response?.data?.message || "The coupon code isn't valid. Verify the code and try again.");
    } finally {
      setApplyingCoupon(false);
    }
  }, [couponCode, onCouponApplied]);

  const handleRemoveCoupon = useCallback(async () => {
    setApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const result = await removeCoupon();
      if (result.success) {
        setCouponSuccess("Coupon removed successfully!");
        setTimeout(() => setCouponSuccess(""), 3000);
        // Use onCouponRemoved if distinct logic needed, else onCouponApplied can refresh totals
        if (onCouponRemoved) await onCouponRemoved();
        else if (onCouponApplied) await onCouponApplied();
      } else {
        setCouponError(result.message || "Failed to remove coupon.");
      }
    } catch (err) {
      console.error("Failed to remove coupon:", err);
      setCouponError(err.response?.data?.message || "Failed to remove coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  }, [onCouponApplied, onCouponRemoved]);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div
        className={`p-4 border-b cursor-pointer flex justify-between items-center ${sectionCompleted.review ? "bg-green-50" : ""} ${!sectionCompleted.payment ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => sectionCompleted.payment && toggleSection("review")}
      >
        <h2 className="text-lg font-semibold">
          {sectionCompleted.review ? (
            <span className="text-green-600">✓ </span>
          ) : (
            <span className="text-gray-400">4. </span>
          )}
          Review & Place Order
        </h2>
        <svg
          className={`h-5 w-5 transform ${sectionExpanded.review ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {sectionExpanded.review && sectionCompleted.payment && (
        <div className="p-6">
          {sectionLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p><strong>Address:</strong> {formatAddressDisplay(shippingAddress)}</p>
                  <p><strong>Method:</strong> {selectedShippingMethod ? `${selectedShippingMethod.carrier_title} - ${selectedShippingMethod.method_title} (${formatPrice(selectedShippingMethod.amount || selectedShippingMethod.price_incl_tax || 0)})` : "Not selected"}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Billing Information</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p><strong>Address:</strong> {shippingAddress.same_as_billing ? "Same as shipping" : formatAddressDisplay(billingAddress)}</p>
                  <p><strong>Payment Method:</strong> {selectedPaymentMethod ? selectedPaymentMethod.title : "Not selected"}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Order Items</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="divide-y divide-gray-200">
                    {cartItems && cartItems.map((item) => (
                      <div key={item.item_id || item.sku} className="py-3 flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                          {item.extension_attributes?.image_url ? (
                            <img src={item.extension_attributes.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy"/>
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center"><span className="text-xs text-gray-500">No image</span></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.qty)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {orderSummary && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">{formatPrice(orderSummary.subtotal_with_discount || orderSummary.subtotal || 0)}</span></div>
                      {orderSummary.discount_amount !== 0 && (
                        <div className="flex justify-between"><span className="text-green-600">Discount ({orderSummary.coupon_code || 'Auto'})</span><span className="font-medium text-green-600">-{formatPrice(Math.abs(orderSummary.discount_amount))}</span></div>
                      )}
                      <div className="flex justify-between"><span>Shipping ({selectedShippingMethod?.method_title || 'N/A'})</span><span className="font-medium">{formatPrice(orderSummary.shipping_amount || 0)}</span></div>
                      {orderSummary.tax_amount > 0 && (
                        <div className="flex justify-between"><span>Tax</span><span className="font-medium">{formatPrice(orderSummary.tax_amount)}</span></div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-base"><span className="font-semibold">Grand Total</span><span className="font-bold">{formatPrice(orderSummary.grand_total || 0)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Coupon Code</h3>
                {orderSummary?.coupon_code ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-semibold">Applied: {orderSummary.coupon_code}</span>
                    <button type="button" onClick={handleRemoveCoupon} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs" disabled={applyingCoupon}>
                      {applyingCoupon ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"/>
                      <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm">
                        {applyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponSuccess && <p className="text-sm text-green-600 mt-2">{couponSuccess}</p>}
                    {couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-xs text-gray-600">
                    By placing your order, you agree to our{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms and Conditions</a> and{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={sectionLoading || !selectedPaymentMethod || !selectedShippingMethod || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 font-semibold"
                >
                  {sectionLoading ? "Processing Order..." : "Place Order"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ReviewSection = memo(ReviewSectionInternal);

export default ReviewSection;
