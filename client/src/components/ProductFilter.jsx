import React from 'react';

export function ProductFilter({ onFilterChange, maxPrice }) {
  const handleCategoryChange = (event) => {
    onFilterChange({ type: 'category', value: event.target.value });
  };

  const handlePriceChange = (event) => {
    onFilterChange({ type: 'price', value: parseInt(event.target.value, 10) });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select id="category" name="category" onChange={handleCategoryChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Range</label>
        <input type="range" id="price" name="price" min="0" max={maxPrice} onChange={handlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
        <div className="text-right">{`Up to $${maxPrice}`}</div>
      </div>
    </div>
  );
}

export default ProductFilter; 