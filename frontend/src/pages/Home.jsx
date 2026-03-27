import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { FiTrendingUp, FiArrowRight, FiTarget, FiLoader } from "react-icons/fi";
import API from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const title = (blog.title || "").toLowerCase();
    const category = (blog.category || "").toLowerCase();
    const authorName = (blog.author?.name || "").toLowerCase();
    return title.includes(q) || category.includes(q) || authorName.includes(q);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get("/blogs");
        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);
          setError("");
        } else {
          setError("Unexpected API response format");
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Unable to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleSearchEvent = (e) => {
      setSearchQuery(e.detail || "");
    };

    window.addEventListener("filterBlogs", handleSearchEvent);
    return () => {
      window.removeEventListener("filterBlogs", handleSearchEvent);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-stone-100 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. RESPONSIVE BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Amber Blob - Smaller on mobile */}
        <div className="absolute top-10 left-[-10%] md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        {/* Stone/Green Blob - Adjusted position for mobile */}
        <div className="absolute bottom-[-10%] right-[-10%] md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-stone-300/20 dark:bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16">
        
        {/* 2. HERO SECTION - Responsive Height */}
        <section className="mb-10 md:mb-16">
          <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl group cursor-pointer border border-white/20 dark:border-stone-800">
            <img 
              src={(blogs[0] && blogs[0].image) || "https://picsum.photos/800/400"} 
              alt="Featured"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Dynamic Gradient for better text readability on small screens */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
              <div className="flex items-center space-x-2 text-amber-400 mb-3">
                <FiTrendingUp className="animate-bounce" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Featured Today</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-3xl leading-tight">
                {(blogs[0] && blogs[0].title) || "React Tips"}: Navigating the Future of {(blogs[0] && blogs[0].category) || "Tech"}
              </h1>
              <button
                onClick={() => {
                  if (blogs.length > 0) {
                    navigate(`/blog/${blogs[0]._id}`);
                  }
                }}
                disabled={blogs.length === 0}
                className="mt-6 w-full sm:w-fit flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Read Story</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* 3. MAIN GRID - Stacked on Mobile, 3-cols on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Side: Blog Feed (Order 2 on mobile so sidebar can be on top if desired, or leave as is) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-white">Latest Stories</h2>
                  <div className="h-px w-24 bg-stone-200 dark:bg-stone-800"></div>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blogs by title, author, category..."
                  className="w-full sm:w-96 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

            {/* Blog Cards: 1 col on mobile, 2 on tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {loading ? (
                <div className="col-span-1 md:col-span-2 flex items-center justify-center py-20">
                  <FiLoader className="animate-spin text-3xl text-stone-500" />
                </div>
              ) : error ? (
                <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                  {error}
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-200">
                  {searchQuery ? 'No blogs match your search query.' : 'No blogs available yet. Start writing your first story!'}
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <BlogCard key={blog._id || blog.id} blog={blog} />
                ))
              )}
            </div>
          </div>

          {/* Right Side: Sidebar (Order 1 on mobile to show goals first) */}
          <aside className="lg:col-span-1 order-1 lg:order-2">
            {/* Sidebar copied for future enhancement */}
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-stone-900/50 border border-white/20 dark:border-stone-800 text-center text-stone-500 dark:text-stone-400">
              Discover trending stories and share your own content!
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}