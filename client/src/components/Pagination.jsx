import React from "react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalProducts,
  productsPerPage
}) {
  const start = (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, totalProducts);

  const renderPageNumbers = () => {
    const pages = [];
    const isSmallScreen = window.innerWidth <= 768;

    // Handle small screen pagination
    if (isSmallScreen) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
      );

      // Show page numbers and ellipses for small screens
      if (currentPage > 2) {
        pages.push(
          <button
            key="1"
            onClick={() => onPageChange(1)}
            className={`px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 ${currentPage ===
            1
              ? "bg-yellow-500 text-white"
              : "hover:bg-gray-200"}`}
          >
            1
          </button>
        );
        pages.push(
          <button
            key="ellipsis1"
            className="px-4 py-2 text-sm text-gray-500"
            disabled
          >
            ...
          </button>
        );
      }

      pages.push(
        <button
          key={currentPage}
          className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none text-yellow-600  hover:bg-gray-500/5  transition bg-yellow-500/10 ring-2 ring-yellow-500`}
        >
          {currentPage}
        </button>
      );

      if (currentPage < totalPages - 1) {
        pages.push(
          <button
            key="ellipsis2"
            className="px-4 py-2 text-sm text-gray-500"
            disabled
          >
            ...
          </button>
        );
        // pages.push(
        //   <button
        //     key={totalPages}
        //     onClick={() => onPageChange(totalPages)}
        //     className={`px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 ${currentPage === totalPages ? "bg-yellow-500 text-white" : "hover:bg-gray-200"}`}
        //   >
        //     {totalPages}
        //   </button>
        // );
      }

      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      );
    } else {
      // Handle larger screens (desktop/tablet)
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      if (startPage > 2) {
        pages.push(
          <button
            key="1"
            onClick={() => onPageChange(1)}
            className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none ${currentPage ===
            1
              ? "text-yellow-600 bg-yellow-500/10 ring-2 ring-yellow-500"
              : "hover:bg-gray-500/5 focus:bg-yellow-500/10"} transition`}
          >
            1
          </button>
        );
        pages.push(
          <button
            key="ellipsis1"
            className="relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none text-gray-500"
            disabled
          >
            ...
          </button>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none ${currentPage ===
            i
              ? "text-yellow-600 bg-yellow-500/10 ring-2 ring-yellow-500"
              : "hover:bg-gray-500/5 focus:bg-yellow-500/10"} transition`}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages - 1) {
        pages.push(
          <button
            key="ellipsis2"
            className="relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none text-gray-500"
            disabled
          >
            ...
          </button>
        );
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 rounded-md outline-none ${currentPage ===
            totalPages
              ? "text-yellow-600 bg-yellow-500/10 ring-2 ring-yellow-500"
              : "hover:bg-gray-500/5 focus:bg-yellow-500/10"} transition`}
          >
            {totalPages}
          </button>
        );
      }

      pages.unshift(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
      );

      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center w-full mt-6 p-3.5 rounded-xl bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.2)]">
      {/* Results info display */}
      <div className="flex items-center text-sm text-gray-500">
        Showing {start} to {end} of {totalProducts} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-4">
        {renderPageNumbers()}
      </div>
    </div>
  );
}
