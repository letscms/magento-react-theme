import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const GroupedProductItems = ({ product, onGroupedItemsChange }) => {
  const { items: groupedItems } = product || {};
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize quantities based on default_qty or 0
  useEffect(() => {
    if (!groupedItems || !Array.isArray(groupedItems)) return;

    const initialQuantities = groupedItems.reduce((acc, item) => {
      const sku = item?.product?.sku;
      if (sku) {
        acc[sku] = item?.qty || 0;
      }
      return acc;
    }, {});

    setItemQuantities(initialQuantities);
    if (onGroupedItemsChange) {
      onGroupedItemsChange(initialQuantities);
    }
  }, [groupedItems, onGroupedItemsChange]);

  const handleQuantityChange = useCallback(
    (sku, newQuantity) => {
      const qty = parseInt(newQuantity, 10);
      if (isNaN(qty) || qty < 0) return;

      setItemQuantities((prev) => {
        const updatedQuantities = { ...prev, [sku]: qty };
        if (onGroupedItemsChange) {
          onGroupedItemsChange(updatedQuantities);
        }
        return updatedQuantities;
      });
    },
    [onGroupedItemsChange]
  );

  if (!groupedItems || !Array.isArray(groupedItems) || groupedItems.length === 0) {
    return <p className="text-gray-600 mt-4">This product has no associated items.</p>;
  }

  return (
    <div className="mt-4 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Included Items</h4>
      <div className="space-y-4">
        {groupedItems.map((item) => {
          const { product } = item || {};
          const sku = product?.sku;
          if (!product || !sku) return null;

          return (
            <div
              key={product.id || sku}
              className="p-4 border rounded-md shadow-sm bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex items-center mb-3 sm:mb-0">
                {product.small_image?.url && (
                  <img
                    src={product.small_image.url}
                    alt={product.small_image.label || product.name}
                    className="w-16 h-16 object-contain mr-4 rounded"
                    onError={(e) => {
                      e.target.src = '/path/to/fallback-image.jpg'; // Fallback image
                    }}
                  />
                )}
                <div>
                  <Link
                    to={`/product/${product.url_key}`}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    {product.name || 'Unnamed Product'}
                  </Link>
                  <p className="text-sm text-gray-500">SKU: {sku}</p>
                  {product.price_range?.minimum_price?.final_price && (
                    <p className="text-sm text-gray-700">
                      Price:{' '}
                      {formatPrice(
                        product.price_range.minimum_price.final_price.value,
                        product.price_range.minimum_price.final_price.currency
                      )}
                    </p>
                  )}
                  <p
                    className={`text-sm ${
                      product.stock_status === 'IN_STOCK' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor={`qty-${sku}`}
                  className="text-sm font-medium text-gray-700 mr-2 sr-only"
                >
                  Quantity for {product.name}:
                </label>
                <input
                  type="number"
                  id={`qty-${sku}`}
                  min="0"
                  value={itemQuantities[sku] || 0}
                  onChange={(e) => handleQuantityChange(sku, e.target.value)}
                  className="w-20 py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={product.stock_status !== 'IN_STOCK'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// In your AddToCartButton.jsx or wherever you handle adding to cart
const handleAddToCart = async () => {
  setLoading(true);
  setError('');
  
  try {
    // For grouped products
    if (product.__typename === "GroupedProduct") {
      // Make sure we have the grouped items with quantities
      const groupedItemsToAdd = {
        sku: product.sku,
        __typename: "GroupedProduct",
        items: groupedItems.filter(item => item.quantity > 0)
      };
      
      // Only proceed if at least one item has a quantity
      if (groupedItemsToAdd.items.length === 0) {
        setError('Please select at least one item to add to cart');
        return;
      }
      
      await addItemToCart(groupedItemsToAdd);
      setSuccess('Items added to cart successfully');
    } else {
      // Handle regular products
      // ...existing code...
    }
  } catch (err) {
    console.error('Failed to add to cart:', err);
    setError(err.message || 'Could not add to cart');
  } finally {
    setLoading(false);
  }
};

export default GroupedProductItems;