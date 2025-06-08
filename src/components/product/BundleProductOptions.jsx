import React, { useState, useEffect, useCallback, memo } from 'react';
import { formatPrice } from '../../utils/formatters';

const BundleProductOptions = ({ product, onBundleSelectionChange }) => {
  const { items: bundleItems } = product;
  const [selectedBundleOptions, setSelectedBundleOptions] = useState({});
  const [bundleTotalPrice, setBundleTotalPrice] = useState(product.price_range.minimum_price.final_price.value);

  // Initialize selected options
  useEffect(() => {
    const initialSelections = {};
    let initialPrice = parseFloat(product.price_range.minimum_price.final_price.value);

    if (bundleItems) {
      bundleItems.forEach(item => {
        if (item.options && item.options.length > 0) {
          const defaultOption = item.options.find(opt => opt.is_default) || item.options[0];
          if (defaultOption) {
            initialSelections[item.option_id] = {
              option_id: item.option_id,
              selection_id: defaultOption.id,
              quantity: defaultOption.quantity,
              price: parseFloat(defaultOption.price),
              product_id: defaultOption.product.id, // Store product_id for cart
              sku: defaultOption.product.sku, // Store SKU for cart
            };
            // Adjust initial price if bundle price is dynamic and default option has a price
            // This depends on Magento's bundle pricing (fixed vs dynamic)
            // For simplicity, assuming price is additive for dynamic bundles if option.price > 0
            // If product price already includes default options, this logic might need adjustment
            if (product.price_view === 'PRICE_RANGE') { // Indicates dynamic pricing
                 initialPrice += parseFloat(defaultOption.price) * defaultOption.quantity;
            }
          }
        }
      });
    }
    setSelectedBundleOptions(initialSelections);
    // setBundleTotalPrice(initialPrice); // Initial price calculation might be complex
    if (onBundleSelectionChange) {
      onBundleSelectionChange(initialSelections, initialPrice);
    }
  }, [bundleItems, product.price_range.minimum_price.final_price.value, product.price_view, onBundleSelectionChange]);

  const handleOptionChange = (itemOptionId, selectionId, quantity) => {
    setSelectedBundleOptions(prev => {
      const newSelections = { ...prev };
      const item = bundleItems.find(i => i.option_id === itemOptionId);
      const selectedOpt = item.options.find(o => o.id === selectionId);

      if (selectedOpt) {
        newSelections[itemOptionId] = {
          option_id: itemOptionId,
          selection_id: selectionId,
          quantity: quantity || selectedOpt.quantity, // Use passed quantity or default
          price: parseFloat(selectedOpt.price),
          product_id: selectedOpt.product.id,
          sku: selectedOpt.product.sku,
        };
      }
      return newSelections;
    });
  };

  const handleQuantityChange = (itemOptionId, selectionId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty >= 0) { // Allow 0 if item can be deselected, or 1 if always required
      handleOptionChange(itemOptionId, selectionId, qty);
    }
  };

  // Recalculate total price when selections change
  useEffect(() => {
    let currentPrice = parseFloat(product.price_range.minimum_price.final_price.value);
    if (product.price_view === 'PRICE_RANGE') { // Dynamic pricing
        currentPrice = 0; // Start from 0 for dynamic bundles if base price is for the bundle shell
        // Or, if the product.price_range.minimum_price.final_price.value is a base price, start with that.
        // This part is highly dependent on how Magento GraphQL reports bundle prices.
        // Assuming for dynamic, the main product price is a base, and options add to it.
        // If fixed price, this calculation is not needed as price is static.
    }


    Object.values(selectedBundleOptions).forEach(selection => {
      if (product.price_view === 'PRICE_RANGE') {
        currentPrice += selection.price * selection.quantity;
      }
      // For FIXED price bundles, the price doesn't change with options.
      // The `product.price_range.minimum_price.final_price.value` is the fixed total.
    });

    setBundleTotalPrice(currentPrice);
    if (onBundleSelectionChange) {
      onBundleSelectionChange(selectedBundleOptions, currentPrice);
    }
  }, [selectedBundleOptions, product.price_range.minimum_price.final_price.value, product.price_view, onBundleSelectionChange]);


  if (!bundleItems || bundleItems.length === 0) {
    return <p>This bundle product has no items configured.</p>;
  }

  return (
    <div className="mt-4 mb-6 space-y-6">
      {bundleItems.map(item => (
        <div key={item.option_id} className="border p-4 rounded-md shadow-sm bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {item.title} {item.required && <span className="text-red-500">*</span>}
          </h4>
          {item.options && item.options.length > 0 ? (
            <div className="space-y-3">
              {item.type === 'select' || item.type === 'radio' ? (
                <select
                  id={`bundle-item-${item.option_id}`}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedBundleOptions[item.option_id]?.selection_id || ''}
                  onChange={(e) => handleOptionChange(item.option_id, parseInt(e.target.value))}
                  disabled={item.options.length === 1 && item.required}
                >
                  {!item.required && <option value="">None</option>}
                  {item.options.map(opt => (
                    <option key={opt.id} value={opt.id} disabled={opt.product.stock_status !== 'IN_STOCK'}>
                      {opt.label}
                      {opt.product.stock_status !== 'IN_STOCK' && ' (Out of stock)'}
                      {opt.price > 0 && ` (+${formatPrice(opt.price, product.price_range.minimum_price.final_price.currency)})`}
                    </option>
                  ))}
                </select>
              ) : item.type === 'checkbox' || item.type === 'multi' ? (
                item.options.map(opt => (
                  <div key={opt.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`bundle-opt-${opt.id}`}
                      checked={!!selectedBundleOptions[item.option_id]?.find(s => s.selection_id === opt.id)}
                      onChange={(e) => {
                        // This logic needs to be more complex for multi-select
                        // For now, simplifying: assumes single selection for checkbox for demo
                        if (e.target.checked) {
                          handleOptionChange(item.option_id, opt.id, opt.quantity);
                        } else {
                          // Logic to remove the option
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      disabled={opt.product.stock_status !== 'IN_STOCK'}
                    />
                    <label htmlFor={`bundle-opt-${opt.id}`} className={`ml-2 text-sm ${opt.product.stock_status !== 'IN_STOCK' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {opt.label}
                      {opt.product.stock_status !== 'IN_STOCK' && ' (Out of stock)'}
                      {opt.price > 0 && ` (+${formatPrice(opt.price, product.price_range.minimum_price.final_price.currency)})`}
                    </label>
                  </div>
                ))
              ) : (
                 <p className="text-sm text-gray-500">Unsupported option type: {item.type}</p>
              )}

              {/* Quantity for the selected option if changeable */}
              {selectedBundleOptions[item.option_id] && item.options.find(o => o.id === selectedBundleOptions[item.option_id].selection_id)?.can_change_quantity && (
                <div className="mt-2 flex items-center">
                  <label htmlFor={`qty-${item.option_id}`} className="text-sm font-medium text-gray-700 mr-2">Quantity:</label>
                  <input
                    type="number"
                    id={`qty-${item.option_id}`}
                    min={item.required ? 1 : 0} // Or based on specific option min/max
                    value={selectedBundleOptions[item.option_id]?.quantity || 1}
                    onChange={(e) => handleQuantityChange(item.option_id, selectedBundleOptions[item.option_id].selection_id, e.target.value)}
                    className="w-20 py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!selectedBundleOptions[item.option_id] || item.options.find(o => o.id === selectedBundleOptions[item.option_id].selection_id)?.product.stock_status !== 'IN_STOCK'}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No options available for this item.</p>
          )}
        </div>
      ))}
      {product.price_view === 'PRICE_RANGE' && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-xl font-semibold text-gray-800">
            Bundle Price: {formatPrice(bundleTotalPrice, product.price_range.minimum_price.final_price.currency)}
          </h4>
        </div>
      )}
    </div>
  );
};

export default memo(BundleProductOptions);