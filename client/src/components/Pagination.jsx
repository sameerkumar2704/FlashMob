import React from "react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalProducts,
  productsPerPage,
}) {
  const start = (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, totalProducts);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none ${
            currentPage === i
              ? "text-yellow-600 bg-yellow-500/10 ring-2 ring-yellow-500"
              : "hover:bg-gray-500/5 focus:bg-yellow-500/10"
          } transition`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className='flex justify-between items-center w-fit mx-auto text-sm h-fit  px-3 py-2 box-border  rounded-xl bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'>
      {/* Pagination controls */}
      <div className='flex items-center space-x-4'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        {/* Page numbers */}
        <div className='flex items-center space-x-2'>{renderPageNumbers()}</div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  );
}
