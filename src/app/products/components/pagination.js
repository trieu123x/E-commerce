export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`px-4 py-2 rounded 
              ${page === pageNumber 
                ? "bg-red-500 text-white" 
                : "bg-gray-200"}`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}