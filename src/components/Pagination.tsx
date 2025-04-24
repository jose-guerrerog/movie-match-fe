import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if we have fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise, show some pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages, then ellipsis, then last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(null); // ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, then ellipsis, then last 3 pages
        pages.push(1);
        pages.push(null); // ellipsis
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current and neighbors, ellipsis, last page
        pages.push(1);
        pages.push(null); // ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(null); // ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        Previous
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        page === null ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`w-10 h-10 rounded-full ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        Next
      </button>
    </div>
  );
};