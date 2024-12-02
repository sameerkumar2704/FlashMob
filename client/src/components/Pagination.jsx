import React from 'react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const goToNextPage = () => onPageChange(currentPage + 1);
  const goToPreviousPage = () => onPageChange(currentPage - 1);

  return (
    <div className="flex justify-between items-center mt-4">
      <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50">Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50">Next</button>
    </div>
  );
}