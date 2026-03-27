import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import API from '../services/api';

const LikeButton = ({ blogId, initialLikes = [], currentUser = null }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes?.length || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && initialLikes) {
      setLiked(initialLikes
        .map((like) => like?.toString?.() || like)
        .includes(currentUser._id?.toString?.()));
      setCount(initialLikes.length);
    } else {
      setLiked(false);
      setCount(initialLikes?.length || 0);
    }
  }, [initialLikes, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) {
      alert('Please login to like this blog');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/blogs/${blogId}/like`);
      
      if (response.data) {
        setLiked(response.data.isLiked);
        setCount(response.data.likesCount);
      }
    } catch (err) {
      console.error('Failed to like blog:', err);
      alert('Failed to update like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleLike}
      disabled={loading}
      className="group flex flex-col items-center space-y-1 transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className={`
        h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-all duration-300
        ${liked 
          ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] text-white' 
          : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 group-hover:border-red-200'}
      `}>
        <FiHeart className={`inline-block leading-none text-xl md:text-2xl ${liked ? 'fill-current animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      </div>
      <span className={`text-[10px] md:text-xs font-black uppercase tracking-tighter ${liked ? 'text-red-500' : 'text-stone-400'}`}>
        {count.toLocaleString()}
      </span>
    </button>
  );
};

export default LikeButton;