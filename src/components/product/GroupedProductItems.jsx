import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const GroupedProductItems = ({ product, onGroupedItemsChange }) => {
  const { items: groupedItems } = product;
  // State to hold quantities for each item in the group
  // Keyed by SKU or ID, e.g., { 'SKU1': 2, 'SKU2': 1 }
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize quantities based on default_qty or 0
  useEffect(() => {
    const initialQuantities = {};
    if (groupedItems) {
      groupedItems.forEach(item => {
        initialQuantities[item.product.sku] = item.qty || 0; // Use default_quantity or 0
      });
    }
    setItemQuantities(initialQuantities);
    if (onGroupedItemsChange) {
      onGroupedItemsChange(initialQuantities);
    }
  }, [groupedItems, onGroupedItemsChange]);

  const handleQuantityChange = useCallback((sku, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (!isNaN(qty) && qty >= 0) {
      setItemQuantities(prev => {
        const updatedQuantities = { ...prev, [sku]: qty };
        if (onGroupedItemsChange) {
          onGroupedItemsChange(updatedQuantities);
        }
        return updatedQuantities;
      });
    }
  }, [onGroupedItemsChange]);

  if (!groupedItems || groupedItems.length === 0) {
    return <p className="text-gray-600 mt-4">This product has no associated items.</p>;
  }

  return (
    <div className="mt-4 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Included Items</h4>
      <div className="space-y-4">
        {groupedItems.map(item => (
          <div key={item.product.id || item.product.sku} className="p-4 border rounded-md shadow-sm bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-3 sm:mb-0">
              {item.product.small_image?.url && (
                <img 
                  src={item.product.small_image.url} 
                  alt={item.product.small_image.label || item.product.name} 
                  className="w-16 h-16 object-contain mr-4 rounded"
                />
              )}
              <div>
                <Link to={`/product/${item.product.url_key}`} className="text-indigo-600 hover:underline font-medium">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                {item.product.price_range?.minimum_price?.final_price && (
                  <p className="text-sm text-gray-700">
                    Price: {formatPrice(item.product.price_range.minimum_price.final_price.value, item.product.price_range.minimum_price.final_price.currency)}
                  </p>
                )}
                 <p className={`text-sm ${item.product.stock_status === 'IN_STOCK' ? 'text-green-600' : 'text-red-500'}`}>
                  {item.product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor={`qty-${item.product.sku}`} className="text-sm font-medium text-gray-700 mr-2 sr-only">
                Quantity for {item.product.name}:
              </label>
              <input
                type="number"
                id={`qty-${item.product.sku}`}
                min="0"
                value={itemQuantities[item.product.sku] || 0}
                onChange={(e) => handleQuantityChange(item.product.sku, e.target.value)}
                className="w-20 py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={item.product.stock_status !== 'IN_STOCK'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedProductItems;