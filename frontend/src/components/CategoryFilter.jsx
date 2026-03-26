export default function CategoryFilter({ selectedCategory, setCategory }) {
  const categories = ["All", "Tech", "Health", "Education", "Sports", "Lifestyle"];

  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        
        return (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300
              ${isActive 
                ? "bg-green-600 text-white shadow-[0_10px_20px_rgba(22,163,74,0.3)] scale-105" 
                : "bg-white/60 dark:bg-stone-900/60 backdrop-blur-md text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-green-500/50"
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}