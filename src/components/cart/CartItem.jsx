import React, { useState, useCallback } from 'react';
import useCart from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Simple debounce implementation
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Handle quantity change with debouncing
  const handleQuantityChange = useCallback(
    debounce(async (newQuantity) => {
      if (newQuantity === item.qty || newQuantity < 1 || isUpdating) return;

      try {
        setIsUpdating(true);
        await updateItemQuantity(item.item_id, newQuantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setIsUpdating(false);
      }
    }, 300),
    [item.item_id, item.qty, isUpdating, updateItemQuantity]
  );

  // Handle item removal
  const handleRemove = useCallback(async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      await removeItem(item.item_id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [item.item_id, isUpdating, removeItem]);

  // Calculate item total price
  const itemTotal = (item.price * item.qty).toFixed(2);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 fade-in section transition-shadow">
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          .section:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="item-image w-full sm:w-20 h-20 flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="item-details flex-1">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
        {item.options && item.options.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.options.map((option, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {option.label}: {option.value}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="item-price text-sm sm:text-base font-medium text-gray-800">
        ${item.price.toFixed(2)}
      </div>

      <div className="item-quantity flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.qty - 1)}
          disabled={isUpdating || item.qty <= 1}
          className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors ${
            isUpdating || item.qty <= 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-12 text-center text-sm sm:text-base">
          {isUpdating ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
          ) : (
            item.qty
          )}
        </span>
        <button
          onClick={() => handleQuantityChange(item.qty + 1)}
          disabled={isUpdating || item.qty >= 99}
          className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors ${
            isUpdating || item.qty >= 99 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="item-total text-sm sm:text-base font-medium text-gray-800">
        ${itemTotal}
      </div>

      <div className="item-actions">
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className={`text-sm text-red-600 hover:text-red-800 transition-colors ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Remove item from cart"
        >
          {isUpdating ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CartItem);