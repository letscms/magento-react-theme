import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import LoadingSpinner from '../utils/Loader';

const Cart = () => {
  const { 
    cartItems, 
    loading, 
    updating, 
    error, 
    fetchCartData, 
    updateItemQuantity, 
    removeItem, 
    calculateSubtotal 
  } = useCart();

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Error Loading Cart</h2>
          <p className="text-gray-600 mb-6 text-center text-sm md:text-base">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={fetchCartData} 
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render empty cart state
  if (!loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-200">
              {cartItems.map(item => (
                <div key={item.item_id} className="p-4">
                  <div className="flex gap-4">
                    {item.extension_attributes?.image_url ? (
                      <img 
                        src={item.extension_attributes.image_url} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateItemQuantity(item.item_id, Math.max(1, item.qty - 1))}
                        disabled={updating || item.qty <= 1}
                        className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItemQuantity(item.item_id, parseInt(e.target.value) || 1)}
                        className="w-14 h-10 border-t border-b border-gray-300 text-center focus:outline-none text-sm"
                      />
                      <button 
                        onClick={() => updateItemQuantity(item.item_id, item.qty + 1)}
                        disabled={updating}
                        className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-medium">{formatPrice(item.price * item.qty)}</p>
                      <button 
                        onClick={() => removeItem(item.item_id)}
                        disabled={updating}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop View */}
            <table className="hidden md:table w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm">Product</th>
                  <th className="py-3 px-4 text-center text-sm">Price</th>
                  <th className="py-3 px-4 text-center text-sm">Quantity</th>
                  <th className="py-3 px-4 text-center text-sm">Total</th>
                  <th className="py-3 px-4 text-center text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <tr key={item.item_id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {item.extension_attributes?.image_url ? (
                          <img 
                            src={item.extension_attributes.image_url} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-sm">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateItemQuantity(item.item_id, Math.max(1, item.qty - 1))}
                          disabled={updating || item.qty <= 1}
                          className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItemQuantity(item.item_id, parseInt(e.target.value) || 1)}
                          className="w-14 h-10 border-t border-b border-gray-300 text-center focus:outline-none text-sm"
                        />
                        <button 
                          onClick={() => updateItemQuantity(item.item_id, item.qty + 1)}
                          disabled={updating}
                          className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-sm">
                      {formatPrice(item.price * item.qty)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => removeItem(item.item_id)}
                        disabled={updating}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Continue Shopping
              </span>
            </Link>
            <button 
              onClick={fetchCartData} 
              className="text-gray-600 hover:text-gray-800 text-sm"
              disabled={updating || loading}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh Cart
              </span>
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatPrice(calculateSubtotal())}</span>
                </div>
              </div>
            </div>
            <div classNameanilla="mt-6">
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-1 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base sm:py-3"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;