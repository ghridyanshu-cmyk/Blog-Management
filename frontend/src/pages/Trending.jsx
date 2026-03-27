import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiLoader, FiAlertCircle } from 'react-icons/fi';
import BlogCard from '../components/BlogCard';
import API from '../services/api';

const Trending = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const response = await API.get('/blogs');

        if (response.data && response.data.blogs) {
          const sorted = [...response.data.blogs].sort((a, b) => {
            const aLikes = a.likes?.length || 0;
            const bLikes = b.likes?.length || 0;
            if (bLikes !== aLikes) return bLikes - aLikes;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setBlogs(sorted);
          setError('');
        } else {
          setError('Unexpected response format from server.');
        }
      } catch (e) {
        console.error('Trending fetch error:', e);
        setError('Failed to load trending posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-serif font-bold">Trending Stories</h1>
          <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-300 text-sm font-bold uppercase tracking-widest">
            <FiTrendingUp /> Most liked
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-stone-500 dark:text-stone-400 gap-2">
            <FiLoader className="animate-spin" /> Loading trending articles...
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-2xl text-red-700 dark:text-red-300">
            <FiAlertCircle className="inline-block mr-2" /> {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-6 bg-stone-100 dark:bg-stone-800 rounded-2xl text-center text-stone-500 dark:text-stone-300">
            No trending posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
