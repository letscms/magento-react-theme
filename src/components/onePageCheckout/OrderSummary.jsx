import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const OrderSummaryInternal = ({ cartItems, orderSummary, selectedShippingMethod }) => {
  // Ensure cartItems is an array to prevent errors if it's undefined or null
  const itemsToDisplay = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Items ({itemsToDisplay.length})</h3>
        {itemsToDisplay.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Added pr-2 for scrollbar spacing */}
            {itemsToDisplay.map(item => (
              <div key={item.item_id || item.sku} className="flex items-center py-2"> {/* Added item.sku as fallback key */}
                <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded border border-gray-200">
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
                <div className="ml-3 flex-1 min-w-0"> {/* Added min-w-0 for better truncation */}
                  <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="text-sm font-medium text-gray-900 ml-2"> {/* Added ml-2 for spacing */}
                  {formatPrice((item.price || 0) * (item.qty || 0))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Your cart is empty.</p>
        )}
      </div>
      
      {orderSummary && (
        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(orderSummary.subtotal_with_discount || orderSummary.subtotal || 0)}</span>
          </div>
          
          {orderSummary.discount_amount < 0 && ( // Check if discount_amount is negative
            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({orderSummary.coupon_code || 'Auto'})</span>
              <span className="font-medium text-green-600">{formatPrice(orderSummary.discount_amount)}</span>
            </div>
          )}
          
          {/* Display shipping only if available in orderSummary */}
          {typeof orderSummary.shipping_amount === 'number' && (
             <div className="flex justify-between">
               <span className="text-gray-600">Shipping {selectedShippingMethod ? `(${selectedShippingMethod.method_title || selectedShippingMethod.carrier_title})` : ''}</span>
               <span className="font-medium">{formatPrice(orderSummary.shipping_amount)}</span>
             </div>
          )}
          
          {orderSummary.tax_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(orderSummary.tax_amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-semibold text-base">Grand Total</span>
            <span className="font-bold text-lg">{formatPrice(orderSummary.grand_total || 0)}</span>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/cart" className="text-blue-600 hover:text-blue-800 text-sm flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Edit Cart
        </Link>
      </div>
    </div>
  );
};

const OrderSummary = memo(OrderSummaryInternal);

export default OrderSummary;