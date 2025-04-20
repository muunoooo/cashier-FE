import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const generatePageNumbers = (
  currentPage: number,
  totalPages: number
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  return pages;
};

const PaginationDashboard: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const validTotalPages = totalPages < 1 ? 1 : totalPages;

  const pageNumbers = generatePageNumbers(currentPage, validTotalPages);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < validTotalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="w-full flex justify-end items-center mt-4 gap-2">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            className={`px-4 py-2 rounded-md font-medium ${
              currentPage === page
                ? "bg-[#A76545] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === validTotalPages}
        className="px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationDashboard;
