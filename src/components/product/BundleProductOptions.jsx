import React, { useState, useEffect, useCallback, memo } from 'react';
import { formatPrice } from '../../utils/formatters';

const BundleProductOptions = ({ product, onBundleSelectionChange }) => {
  const { items: bundleItems } = product;
  const [selectedBundleOptions, setSelectedBundleOptions] = useState({});
  const [bundleTotalPrice, setBundleTotalPrice] = useState(0);
// // console.log("bundleItems", bundleItems);
  // Initialize selected options
  useEffect(() => {
    const initialSelections = {};
    let initialPrice = 0; // Start with 0 for dynamic pricing

    if (bundleItems) {
      bundleItems.forEach((item) => {
        if (item.options && item.options.length > 0) {
          const defaultOption = item.options.find((opt) => opt.is_default) || item.options[0];
          if (defaultOption && defaultOption.product.stock_status === 'IN_STOCK') {
            const optionPrice = defaultOption.product.price_range.minimum_price.final_price.value || 0;
            initialSelections[item.option_id] = {
              option_id: item.option_id,
              selection_id: defaultOption.id,
              quantity: defaultOption.quantity || 1,
              price: optionPrice,
              product_id: defaultOption.product.id,
              sku: defaultOption.product.sku,
            };
            initialPrice += optionPrice * (defaultOption.quantity || 1);
          }
        }
      });
    }

    setSelectedBundleOptions(initialSelections);
    setBundleTotalPrice(initialPrice);
    if (onBundleSelectionChange) {
      onBundleSelectionChange(initialSelections, initialPrice);
    }
  }, [bundleItems, onBundleSelectionChange]);

  // Handle option selection change
  const handleOptionChange = useCallback((itemOptionId, selectionId, quantity) => {
    // console.log("itemOptionId", itemOptionId, "selectionId", selectionId, "quantity", quantity);
    setSelectedBundleOptions((prev) => {
      const newSelections = { ...prev };
      const item = bundleItems.find((i) => i.option_id === itemOptionId);
      const selectedOpt = item.options.find((o) => o.id === selectionId);
      // console.log("selectedOpt", selectedOpt);

      if (selectedOpt && selectedOpt.product.stock_status === 'IN_STOCK') {
        const optionPrice = selectedOpt.product.price_range.minimum_price.final_price.value || 0;
        newSelections[itemOptionId] = {
          option_id: itemOptionId,
          selection_id: selectionId,
          quantity: quantity || selectedOpt.quantity || 1,
          price: optionPrice,
          product_id: selectedOpt.product.id,
          sku: selectedOpt.product.sku,
        };
      } else {
        delete newSelections[itemOptionId]; // Remove selection if out of stock or invalid
      }
      return newSelections;
    });
  }, [bundleItems]);

  // Handle quantity change
  const handleQuantityChange = useCallback((itemOptionId, selectionId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty >= 0) {
      handleOptionChange(itemOptionId, selectionId, qty);
    }
  }, [handleOptionChange]);

  // Recalculate total price when selections change
  useEffect(() => {
    let currentPrice = 0;

    Object.values(selectedBundleOptions).forEach((selection) => {
      currentPrice += selection.price * selection.quantity;
    });

    setBundleTotalPrice(currentPrice);
    if (onBundleSelectionChange) {
      onBundleSelectionChange(selectedBundleOptions, currentPrice);
    }
  }, [selectedBundleOptions, onBundleSelectionChange]);

  if (!bundleItems || bundleItems.length === 0) {
    return <p className="text-red-500">This bundle product has no items configured.</p>;
  }

  return (
    <div className="mt-4 mb-6 space-y-6">
      {bundleItems.map((item) => (
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
                  onChange={(e) => handleOptionChange(item.option_id, parseInt(e.target.value, 10))}
                  disabled={item.options.length === 1 && item.required}
                >
                  {!item.required && <option value="">None</option>}
                  {item.options.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.product.stock_status !== 'IN_STOCK'}
                    >
                      {opt.label}
                      {opt.product.stock_status !== 'IN_STOCK' && ' (Out of Stock)'}
                      {opt.product.price_range.minimum_price.final_price.value > 0 &&
                        ` (+${formatPrice(
                          opt.product.price_range.minimum_price.final_price.value,
                          opt.product.price_range.minimum_price.final_price.currency
                        )})`}
                    </option>
                  ))}
                </select>
              ) : item.type === 'checkbox' || item.type === 'multi' ? (
                item.options.map((opt) => (
                  <div key={opt.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`bundle-opt-${opt.id}`}
                      checked={selectedBundleOptions[item.option_id]?.selection_id === opt.id}
                      onChange={(e) => {
                        if (e.target.checked && opt.product.stock_status === 'IN_STOCK') {
                          handleOptionChange(item.option_id, opt.id, opt.quantity || 1);
                        } else {
                          handleOptionChange(item.option_id, null, 0); // Deselect
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      disabled={opt.product.stock_status !== 'IN_STOCK'}
                    />
                    <label
                      htmlFor={`bundle-opt-${opt.id}`}
                      className={`ml-2 text-sm ${
                        opt.product.stock_status !== 'IN_STOCK'
                          ? 'text-gray-400 line-through'
                          : 'text-gray-700'
                      }`}
                    >
                      {opt.label}
                      {opt.product.stock_status !== 'IN_STOCK' && ' (Out of Stock)'}
                      {opt.product.price_range.minimum_price.final_price.value > 0 &&
                        ` (+${formatPrice(
                          opt.product.price_range.minimum_price.final_price.value,
                          opt.product.price_range.minimum_price.final_price.currency
                        )})`}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Unsupported option type: {item.type}</p>
              )}

              {/* Quantity input for selected option */}
              {selectedBundleOptions[item.option_id] &&
                item.options.find(
                  (o) => o.id === selectedBundleOptions[item.option_id].selection_id
                ) && (
                  <div className="mt-2 flex items-center">
                    <label
                      htmlFor={`qty-${item.option_id}`}
                      className="text-sm font-medium text-gray-700 mr-2"
                    >
                      Quantity:
                    </label>
                    <input
                      type="number"
                      id={`qty-${item.option_id}`}
                      min={item.required ? 1 : 0}
                      value={selectedBundleOptions[item.option_id]?.quantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.option_id,
                          selectedBundleOptions[item.option_id].selection_id,
                          e.target.value
                        )
                      }
                      className="w-20 py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled={
                        !selectedBundleOptions[item.option_id] ||
                        item.options.find(
                          (o) => o.id === selectedBundleOptions[item.option_id].selection_id
                        ).product.stock_status !== 'IN_STOCK'
                      }
                    />
                  </div>
                )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No options available for this item.</p>
          )}
        </div>
      ))}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-xl font-semibold text-gray-800">
          Bundle Price:{' '}
          {formatPrice(bundleTotalPrice, product.price_range.minimum_price.final_price.currency)}
        </h4>
      </div>
    </div>
  );
};

export default memo(BundleProductOptions);