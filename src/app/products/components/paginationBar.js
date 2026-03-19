import { useState } from "react";
import { ChevronLeft, ChevronRight, Funnel } from "lucide-react";

export default function PaginationBar({
  page,
  totalPages,
  setPage,
  showFilter,
  setShowFilter
}) {
  const [jumpPage, setJumpPage] = useState("");

  const handleJump = (e) => {
    if (e.key === "Enter") {
      const num = parseInt(jumpPage);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        setPage(num);
      }
      setJumpPage("");
    }
  };

  const renderPages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left dots
    if (page > 3) {
      pages.push("left-dots");
    }

    // Middle pages (n-1, n, n+1)
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    // Right dots
    if (page < totalPages - 2) {
      pages.push("right-dots");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 text-black px-6 py-3 rounded-sm">

      {/* LEFT SIDE - Pagination */}
      <div className="flex items-center gap-2">

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-2 bg-red-500 flex flex-row items-center text-white rounded disabled:opacity-50"
        >
          <ChevronLeft size={24} /> Prev
        </button>

        {renderPages().map((p, index) => {
          if (p === "left-dots" || p === "right-dots") {
            return (
              <input
                key={index}
                type="number"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={handleJump}
                placeholder="..."
                className="w-14 px-2 py-1 border border-gray-300 h-10 rounded text-black text-center"
              />
            );
          }

          return (
            <button
              key={index}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded border border-gray-300
                ${page === p
                  ? "bg-gray-300 text-black"
                  : "bg-gray-100 hover:bg-gray-700"}`}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-2 bg-red-500 flex flex-row items-center text-white rounded disabled:opacity-50"
        >
          Next <ChevronRight size={24} />
        </button>

      </div>

      {/* RIGHT SIDE - Filter Toggle */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className={`p-2 rounded transition
          ${showFilter
            ? "bg-red-500"
            : "bg-gray-700 hover:bg-gray-600"}`}
      >
        <Funnel size={20} />
      </button>

    </div>
  );
}