import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, setPage }) {
  return (
    <div className="flex items-center justify-center mt-12 mb-6 gap-6">
      
      {/* Previous Button */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-lg active:scale-90"
      >
        <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Page Indicator */}
      <div className="flex items-center px-6 py-3 rounded-2xl bg-stone-900 dark:bg-white shadow-xl">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white dark:text-stone-900">
          Page {page}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => setPage(page + 1)}
        className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-green-600 dark:hover:text-green-400 transition-all shadow-sm hover:shadow-lg active:scale-90"
      >
        <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
}