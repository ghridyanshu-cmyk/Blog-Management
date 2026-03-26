import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiClock, FiMessageCircle, FiHeart } from 'react-icons/fi';

const BlogCard = ({ blog }) => {
  const [liked, setLiked] = useState(false);

  const { 
    _id = '1',
    title = "The Future of Design", 
    category = "UI/UX", 
    image = "https://picsum.photos/600/400",
    content = "",
    author = { name: "Author" },
    likes = [],
    comments = []
  } = blog || {};

  const calculateReadTime = () => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const authorInitial = author?.name?.charAt(0).toUpperCase() || 'A';
  const authorName = author?.name || 'Unknown Author';

  const handleLike = (e) => {
    e.preventDefault(); 
    setLiked(!liked);
  };

  return (
    <div className="group relative flex flex-col bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-stone-100 dark:border-stone-800 h-full">
      
      {/* 1. Image Container */}
      <div className="relative h-52 md:h-64 w-full overflow-hidden rounded-[2rem] z-10 shadow-inner">
        <img 
          src={image || "https://picsum.photos/600/400"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 backdrop-blur-xl bg-white/70 dark:bg-stone-900/70 px-4 py-1.5 rounded-2xl border border-white/20">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            {category}
          </span>
        </div>

        {/* --- NEW: Floating Like Button on Image --- */}
        <button 
          onClick={handleLike}
          className={`absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            liked 
            ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40" 
            : "bg-white/70 dark:bg-stone-900/70 border-white/20 text-stone-900 dark:text-white hover:scale-110"
          }`}
        >
          <FiHeart className={`${liked ? "fill-white animate-pulse" : ""}`} size={18} />
        </button>
      </div>

      {/* 2. Card Body */}
      <div className="px-3 pt-6 pb-2 flex-1">
        <div className="flex items-center space-x-4 mb-4 text-stone-400">
          <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest">
            <FiClock className="text-green-500" />
            <span>{calculateReadTime()}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700" />
          <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest">
            <FiMessageCircle className="text-green-500" />
            <span>{comments?.length || 0}</span>
          </div>
        </div>

        <Link to={`/blog/${_id}`}>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </Link>
      </div>

      {/* 3. Interactive Footer */}
      <div className="px-3 pb-2 mt-4 flex items-center justify-between border-t border-stone-50 dark:border-stone-800/50 pt-5">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 overflow-hidden border-2 border-white dark:border-stone-700 flex items-center justify-center text-white font-bold text-sm">
            {authorInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-tighter text-stone-400">Author</span>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 truncate max-w-[120px]">{authorName}</span>
          </div>
        </div>

        <Link 
          to={`/blog/${_id}`}
          className="h-11 w-11 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center transition-all group-hover:bg-green-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 shadow-xl active:scale-90"
        >
          <FiArrowUpRight size={22} />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;