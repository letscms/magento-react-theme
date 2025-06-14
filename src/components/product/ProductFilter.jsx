import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

const ProductFilter = ({ filters, appliedFilters, onFilterChange, categories }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Ensure filters is always an array
  const filtersArray = Array.isArray(filters) ? filters : [];

  // Create a category filter if categories are provided
  const categoryFilter = categories && categories.length > 0 ? {
    attribute_code: 'category_id',
    label: 'Category',
    options: categories.map(cat => ({
      label: cat.name,
      value: cat.id,
      count: cat.product_count
    }))
  } : null;

  // Combine category filter with other filters if it exists
  const allFilters = categoryFilter 
    ? [categoryFilter, ...filtersArray] 
    : filtersArray;

  // Toggle filter section expansion
  const toggleSection = (code) => {
    setExpandedSections(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  // Handle checkbox change
  const handleFilterChange = (attributeCode, value, checked) => {
    const currentValues = appliedFilters[attributeCode] || [];
    
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFilterChange(attributeCode, newValues);
  };

  // Check if a filter is applied
  const isFilterApplied = (attributeCode, value) => {
    return appliedFilters[attributeCode]?.includes(value) || false;
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({});
  };

  // Clear specific filter
  const clearFilter = (attributeCode) => {
    onFilterChange(attributeCode, []);
  };

  // Count total applied filters
  const countAppliedFilters = () => {
    if (!appliedFilters || typeof appliedFilters !== 'object') {
      return 0;
    }
    return Object.values(appliedFilters).reduce((count, values) => {
      return count + (Array.isArray(values) ? values.length : 0);
    }, 0);
  };

  const totalAppliedFilters = countAppliedFilters();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-lg font-semibold">Filters</h2>
        {totalAppliedFilters > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-sm sm:text-base text-indigo-600 hover:text-indigo-800"
          >
            Clear All
          </button>
        )}
      </div>

      {allFilters.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">No filters available</p>
      ) : (
        <div className="space-y-4">
          {allFilters.map(filter => {
            if (!filter || !filter.attribute_code) {
              return null;
            }
            if (filter.attribute_code === 'category_uid') {
              return null;
            }
            
            const isExpanded = expandedSections[filter.attribute_code] !== false;
            const hasAppliedValues = appliedFilters && 
                                   Array.isArray(appliedFilters[filter.attribute_code]) && 
                                   appliedFilters[filter.attribute_code].length > 0;
            
            return (
              <div key={filter.attribute_code} className="border-b pb-3">
                <div 
                  className="flex justify-between items-center cursor-pointer py-2 touch-manipulation"
                  onClick={() => toggleSection(filter.attribute_code)}
                >
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base">{filter.label || filter.attribute_code}</h3>
                    {hasAppliedValues && (
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {appliedFilters[filter.attribute_code].length}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-lg sm:text-xl">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 pl-2 sm:pl-4">
                    {hasAppliedValues && (
                      <div className="flex justify-end mb-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFilter(filter.attribute_code);
                          }}
                          className="text-xs sm:text-sm text-gray-500 hover:text-indigo-600"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {Array.isArray(filter.options) ? (
                        filter.options.map(option => {
                          if (!option || !option.value) {
                            return null;
                          }
                          
                          return (
                            <div key={option.value} className="flex items-center py-1">
                              <input
                                type="checkbox"
                                id={`${filter.attribute_code}-${option.value}`}
                                checked={isFilterApplied(filter.attribute_code, option.value)}
                                onChange={(e) => handleFilterChange(
                                  filter.attribute_code, 
                                  option.value, 
                                  e.target.checked
                                )}
                                className="h-5 w-5 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`${filter.attribute_code}-${option.value}`}
                                className="ml-3 text-sm sm:text-base text-gray-700"
                              >
                                {option.label || option.value} 
                              </label>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm sm:text-base text-gray-500">No options available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

ProductFilter.propTypes = {
  filters: PropTypes.array,
  appliedFilters: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  categories: PropTypes.array
};

ProductFilter.defaultProps = {
  filters: [],
  appliedFilters: {},
  categories: []
};

export default memo(ProductFilter);