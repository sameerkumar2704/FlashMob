import React, { useState } from "react";

export function ProductFilter({ onFilterChange, maxPrice, minPrice }) {
  const [currentPrice, setCurrentPrice] = useState(maxPrice);

  const handlePriceChange = (event) => {
    const newPrice = parseInt(event.target.value, 10);
    setCurrentPrice(newPrice);
  };

  const handleApplyFilter = () => {
    
    onFilterChange({ type: "priceRange", value: currentPrice });
  };

  return (
    <div className='p-4 border rounded shadow-md min-w-52'>
      <h1 className='text-2xl md:text-3xl pl-2 my-2 border-l-4 border-red-400 text-gray-700 font-semibold'>
        Filter
      </h1>

      {/* Category Filter */}

      {/* Price Range Filter */}
      <div className='mb-2 mt-4'>
        <label
          htmlFor='price-range'
          className='block text-sm font-semibold text-gray-700'
        >
          Price Range
        </label>
        <input
          type='range'
          id='price-range'
          className='w-full accent-red-500'
          min={minPrice}
          max={maxPrice}
          value={currentPrice}
          onChange={handlePriceChange}
        />
        <div className='text-sm text-gray-600 text-center'>{`Up to ₹${currentPrice}`}</div>

        <div className='flex justify-between mt-2 text-gray-500 text-sm'>
          <span>{`Min : ₹${minPrice}`}</span>
          <span>{`Max : ₹${maxPrice}`}</span>
        </div>
      </div>

      {/* Apply Changes Button */}
      <button
        onClick={handleApplyFilter}
        className='w-full mt-4 py-2 bg-red-500 text-white rounded-md text-sm'
      >
        Apply Changes
      </button>
    </div>
  );
}
