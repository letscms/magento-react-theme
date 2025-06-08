import React from 'react';
import { formatPrice } from '../../utils/formatters';

const ReviewStep = ({
  shippingAddress,
  billingAddress,
  selectedShippingMethod,
  selectedPaymentMethod,
  cartItems,
  orderSummary,
  onPlaceOrder,
  onBack,
  loading
}) => {
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    
    const parts = [
      `${address.firstname} ${address.lastname}`,
      address.street[0],
      address.street[1],
      `${address.city}, ${address.region} ${address.postcode}`,
      address.country_id,
      address.telephone
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
      
      {/* Shipping Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Shipping Address</h4>
              <p className="text-sm text-gray-600 mt-1">{formatAddress(shippingAddress)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Shipping Method</h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedShippingMethod ? (
                  <>
                    {selectedShippingMethod.carrier_title} - {selectedShippingMethod.method_title}
                    <span className="block">{formatPrice(selectedShippingMethod.amount)}</span>
                  </>
                ) : (
                  'No shipping method selected'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Billing Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Billing Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Billing Address</h4>
              <p className="text-sm text-gray-600 mt-1">
                {shippingAddress.same_as_billing 
                  ? formatAddress(shippingAddress) 
                  : formatAddress(billingAddress)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Payment Method</h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedPaymentMethod ? selectedPaymentMethod.title : 'No payment method selected'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Items</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <div key={item.item_id} className="py-3 flex items-center">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                  {item.extension_attributes?.image_url ? (
                    <img 
                      src={item.extension_attributes.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      {orderSummary && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">{formatPrice(orderSummary.subtotal)}</span>
              </div>
              
              {orderSummary.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-medium text-green-600">-{formatPrice(Math.abs(orderSummary.discount_amount))}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium">{formatPrice(orderSummary.shipping_amount)}</span>
              </div>
              
              {orderSummary.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium">{formatPrice(orderSummary.tax_amount)}</span>
                </div>
              )}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatPrice(orderSummary.grand_total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Terms and Conditions */}
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            By placing your order, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Back to Payment
        </button>
        
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ReviewStep);