import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import API from '../services/api';

const LikeButton = ({ blogId, initialLikes = [], currentUser }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && likes.length > 0) {
      const userId = currentUser._id || currentUser.id;
      setIsLiked(likes.some(id => id === userId || id._id === userId));
    }
  }, [likes, currentUser]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to like this post");
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/blogs/${blogId}/like`);
      if (response.data.success) {
        // We fetch the latest count from the server response
        // Adjust this based on if your backend returns the full array or just a count
        if (isLiked) {
          setLikes(prev => prev.filter(id => id !== (currentUser._id || currentUser.id)));
        } else {
          setLikes(prev => [...prev, (currentUser._id || currentUser.id)]);
        }
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        group flex items-center justify-center gap-2 px-4 h-11 rounded-2xl transition-all shadow-sm border
        ${isLiked 
          ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-950/20 dark:border-red-900/30' 
          : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-500'
        }
      `}
    >
      {/* Icon and Count wrapped in a flex container for perfect vertical alignment */}
      <div className="flex items-center gap-1.5 leading-none">
        <FiHeart 
          size={18} 
          className={`transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
        />
        
        {likes.length > 0 && (
          <span className="text-sm font-bold mt-0.5">
            {likes.length}
          </span>
        )}
      </div>
    </button>
  );
};

export default LikeButton;