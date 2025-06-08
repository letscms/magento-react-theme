import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { formatPrice } from "../../utils/formatters";

const ConfigurableProductOptions = ({
  product,
  onVariantChange,
  selectedOptions: initialSelectedOptions,
}) => {
  const { configurable_options, variants } = product;
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);

  const isInitializedRef = useRef(false);
  const prevVariantRef = useRef(null);

  // Init only once unless product changes
  useEffect(() => {
    if (!configurable_options || isInitializedRef.current) return;

    const initialSelections = {};
    configurable_options.forEach((option) => {
      const attrCode = option.attribute_code;

      if (initialSelectedOptions?.[attrCode]) {
        initialSelections[attrCode] = initialSelectedOptions[attrCode];
      } else {
        const availableValue = option.values.find((value) =>
          variants?.some((variant) =>
            variant.attributes?.some(
              (attr) =>
                attr.code === attrCode && attr.value_index === value.value_index
            )
          )
        );
        initialSelections[attrCode] =
          availableValue?.value_index ?? option.values[0]?.value_index;
      }
    });

    setSelectedOptions(initialSelections);
    isInitializedRef.current = true;
  }, [product]);

  // Handle option change
  const handleOptionChange = (attrCode, valueIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attrCode]: valueIndex,
    }));
  };

  // Update variant based on selected options
  useEffect(() => {
    if (!variants || Object.keys(selectedOptions).length === 0) {
      if (prevVariantRef.current !== null) {
        setCurrentVariant(null);
        onVariantChange?.(null, selectedOptions);
        prevVariantRef.current = null;
      }
      return;
    }

    const allSelected = configurable_options?.every(
      (option) => selectedOptions[option.attribute_code] !== undefined
    );

    if (!allSelected) {
      if (prevVariantRef.current !== null) {
        setCurrentVariant(null);
        onVariantChange?.(null, selectedOptions);
        prevVariantRef.current = null;
      }
      return;
    }

    const matched = variants.find((variant) =>
      variant.attributes?.every(
        (attr) => selectedOptions[attr.code] === attr.value_index
      )
    );

    if (matched !== prevVariantRef.current) {
      setCurrentVariant(matched || null);
      onVariantChange?.(matched || null, selectedOptions);
      prevVariantRef.current = matched || null;
    }
  }, [selectedOptions, variants, configurable_options]);

  // No options? Return null early
  if (!configurable_options?.length) return null;

  return (
    <div className="mt-4 mb-6 space-y-4">
      {configurable_options.map((option) => (
        <div key={option.attribute_code}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {option.attribute_code || option.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected =
                selectedOptions[option.attribute_code] === value.value_index;
              const swatchValue = value.swatch_data?.value;
              const isColorSwatch = /^#([0-9A-F]{3}){1,2}$/i.test(
                swatchValue || ""
              );

              const isOptionAvailable = useMemo(() => {
                return variants?.some((variant) => {
                  const hasThisValue = variant.attributes?.some(
                    (attr) =>
                      attr.code === option.attribute_code &&  
                      attr.value_index === value.value_index
                  );
                  if (!hasThisValue) return false;

                  return Object.entries(selectedOptions).every(
                    ([code, valIdx]) =>
                      code === option.attribute_code ||
                      variant.attributes?.some(
                        (attr) =>
                          attr.code === code && attr.value_index === valIdx
                      )
                  );
                });
              }, [selectedOptions, variants]);

              const commonProps = {
                type: "button",
                onClick: () =>
                  handleOptionChange(option.attribute_code, value.value_index),
                disabled: !isOptionAvailable,
                title: value.label,
              };

              return isColorSwatch ? (
                <button
                  key={value.value_index}
                  {...commonProps}
                  className={`w-8 h-8 rounded-full border-2
        ${
          isSelected
            ? "ring-2 ring-offset-1 ring-indigo-500 border-indigo-500"
            : "border-gray-300"
        }
        ${
          !isOptionAvailable
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400"
        }`}
                  style={{ backgroundColor: swatchValue }}
                  aria-label={value.label}
                />
              ) : (
                <button
                  key={value.value_index}
                  {...commonProps}
                  className={`px-3 py-1 border rounded text-sm
        ${
          isSelected
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white text-gray-700 border-gray-300"
        }
        ${
          !isOptionAvailable
            ? "opacity-50 cursor-not-allowed line-through"
            : "hover:border-gray-500"
        }`}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {currentVariant?.product && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-800">
            Selected: {currentVariant.product.name}
          </p>
          <p className="text-sm text-gray-600">
            SKU: {currentVariant.product.sku}
          </p>
          {currentVariant.product.price_range?.minimum_price?.final_price && (
            <p className="text-sm text-indigo-600 font-semibold">
              Price:{" "}
              {formatPrice(
                currentVariant.product.price_range.minimum_price.final_price
                  .value,
                currentVariant.product.price_range.minimum_price.final_price
                  .currency
              )}
            </p>
          )}
          <p
            className={`text-sm ${
              currentVariant.product.stock_status === "IN_STOCK"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {currentVariant.product.stock_status === "IN_STOCK"
              ? "In Stock"
              : "Out of Stock"}
          </p>
        </div>
      )}

      {!currentVariant &&
        Object.keys(selectedOptions).length > 0 &&
        configurable_options.length === Object.keys(selectedOptions).length && (
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm text-red-700">
              The selected combination is not available.
            </p>
          </div>
        )}
    </div>
  );
};

export default memo(ConfigurableProductOptions);
