// Reusable page-number pagination. Currently paginates data already in memory (client-side
// slicing by the caller); swap the caller's data source for a paged API call later and this
// component's props/behaviour stay the same.
function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const windowSize = 1;

  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  pages.push(1);
  if (start > 2) pages.push("ellipsis-start");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("ellipsis-end");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pageButtonClass = (isActive) =>
    `h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition-colors duration-150 ${
      isActive
        ? "bg-brand-600 text-white"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-night-700"
    }`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors duration-150
          hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
          dark:text-slate-300 dark:hover:bg-night-700"
      >
        Previous
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            type="button"
            onClick={() => goTo(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={pageButtonClass(page === currentPage)}
          >
            {page}
          </button>
        ) : (
          <span key={`${page}-${index}`} className="px-1 text-sm text-slate-400 dark:text-slate-500">
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors duration-150
          hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
          dark:text-slate-300 dark:hover:bg-night-700"
      >
        Next
      </button>
    </nav>
  );
}
