import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { FiTrendingUp, FiArrowRight, FiLoader } from "react-icons/fi";
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

  return (
    <div className="relative min-h-screen bg-stone-100 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-10%] md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-stone-300/20 dark:bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        
        {/* HERO SECTION */}
        {blogs.length > 0 && !searchQuery && (
          <section className="mb-10 md:mb-16">
            <div className="relative h-[400px] sm:h-[450px] md:h-[550px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl group border border-white/20 dark:border-stone-800">
              <img 
                src={blogs[0].image || "https://picsum.photos/1200/600"} 
                alt="Featured"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-16">
                <div className="flex items-center space-x-2 text-amber-400 mb-3">
                  <FiTrendingUp className="animate-bounce" />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Featured Today</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-white max-w-4xl leading-tight">
                  {blogs[0].title}
                </h1>
                <button
                  onClick={() => navigate(`/blog/${blogs[0]._id}`)}
                  className="mt-6 w-full sm:w-fit flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-lg"
                >
                  <span>Read Story</span>
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white shrink-0">
              Latest Stories
            </h2>
            <div className="hidden sm:block h-px flex-grow max-w-[100px] bg-stone-300 dark:bg-stone-700"></div>
          </div>
          
          <div className="w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, category..."
              className="w-full md:w-96 px-5 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-stone-500"
            />
          </div>
        </div>

        {/* BLOG GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <FiLoader className="animate-spin text-4xl text-stone-600 dark:text-stone-300 mb-4" />
            <p className="text-stone-900 dark:text-stone-100 font-bold uppercase tracking-widest text-xs">
              Fetching the latest stories...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div key={blog._id} className="transition-transform duration-300 hover:-translate-y-2">
                   <BlogCard blog={blog} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-dashed border-stone-300 dark:border-stone-700">
                <p className="text-stone-900 dark:text-stone-100 text-xl font-serif font-bold italic">
                  {searchQuery ? `No results found for "${searchQuery}"` : 'The journal is currently empty.'}
                </p>
                <p className="text-stone-600 dark:text-stone-400 mt-2">Try adjusting your search or check back later.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}