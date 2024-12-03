import React, { useState } from "react";

export function ProductFilter({ onFilterChange, maxPrice }) {
  const [currentPrice, setCurrentPrice] = useState(maxPrice);
  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handlePriceChange = (event) => {
    const newPrice = parseInt(event.target.value, 10);
    setCurrentPrice(newPrice);
  };

  const handleApplyFilter = () => {
    onFilterChange({ type: "category", value: category });
    onFilterChange({ type: "priceRange", value: currentPrice });
  };

  return (
    <div className='p-4 border rounded shadow-md min-w-52 '>
      <h1 className='text-2xl md:text-3xl pl-2 my-2 border-l-4 border-red-400 dark: text-gray-700 font-semibold '>
        Filter
      </h1>
      <div className='mb-4 mt-4'>
        <label
          htmlFor='category'
          className='block text-sm font-semibold text-gray-700'
        >
          Category
        </label>
        <select
          id='category'
          value={category}
          onChange={handleCategoryChange}
          className='mt-1 px-2 py-1  block w-full rounded-md shadow-sm outline-none border sm:text-1xl '
        >
          <option value=''>All</option>
          <option value='Electronics'>Electronics</option>
          <option value='Clothing'>Clothing</option>
          <option value='Books'>Books</option>
        </select>
      </div>

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
          min='0'
          max={maxPrice}
          value={currentPrice}
          onChange={handlePriceChange}
        />
        <div className='text-sm text-gray-600 text-center'>{`Up to ₹${currentPrice}`}</div>

        <div className='flex justify-between mt-2 text-gray-500 text-sm'>
          <span>{`Min : ₹0`}</span>
          <span>{`Max : ₹${maxPrice}`}</span>
        </div>
      </div>

      <button
        onClick={handleApplyFilter}
        className='w-full mt-4 py-2 bg-red-500 text-white rounded-md text-sm'
      >
        Apply Changes
      </button>
    </div>
  );
}
