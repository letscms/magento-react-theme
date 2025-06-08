import React, { memo } from 'react';

const ProductSorting = ({ sortBy, sortDirection, onSortChange }) => {
  // Available sorting options
  const sortOptions = [
    { value: 'position', label: 'Position', directions: ['asc', 'desc'] },
    { value: 'name', label: 'Name', directions: ['asc', 'desc'] },
    { value: 'price', label: 'Price', directions: ['asc', 'desc'] },
    { value: 'created_at', label: 'Newest', directions: ['desc'] },
    { value: 'relevance', label: 'Relevance', directions: ['desc'] }
  ];

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, direction] = value.split('-');
    onSortChange(field, direction);
  };

  // Get current sort value
  const getCurrentSortValue = () => {
    return `${sortBy}-${sortDirection}`;
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sort-by" className="mr-2 text-sm text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-by"
        value={getCurrentSortValue()}
        onChange={handleSortChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {sortOptions.flatMap(option => 
          option.directions.map(direction => (
            <option key={`${option.value}-${direction}`} value={`${option.value}-${direction}`}>
              {option.label} {direction === 'asc' ? '(A-Z)' : direction === 'desc' ? '(Z-A)' : ''}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default memo(ProductSorting);