import React, { useEffect, useState } from 'react';
import { FiBookmark, FiLoader, FiAlertCircle } from 'react-icons/fi';
import BlogCard from '../components/BlogCard';
import API from '../services/api';

const Bookmarks = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);

        const savedRaw = localStorage.getItem('savedBlogs');
        const savedIds = savedRaw ? JSON.parse(savedRaw) : [];

        if (!Array.isArray(savedIds) || savedIds.length === 0) {
          setBlogs([]);
          setError('No saved posts yet. Save some posts to see them here.');
          return;
        }

        const response = await API.get('/blogs');

        if (response.data && response.data.blogs) {
          const filtered = response.data.blogs.filter((item) => savedIds.includes(item._id));
          setBlogs(filtered);
          setError(filtered.length === 0 ? 'No saved blog posts found. The posts may have been removed.' : '');
        } else {
          setError('Unexpected response format from server.');
        }
      } catch (e) {
        console.error('Bookmarks fetch error:', e);
        setError('Failed to load saved posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();

    const watcher = () => fetchBookmarks();
    window.addEventListener('storage', watcher);
    window.addEventListener('saveChanged', watcher);

    return () => {
      window.removeEventListener('storage', watcher);
      window.removeEventListener('saveChanged', watcher);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-serif font-bold">Saved Posts</h1>
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 text-sm font-bold uppercase tracking-widest">
            <FiBookmark /> Bookmarks
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-stone-500 dark:text-stone-400 gap-2">
            <FiLoader className="animate-spin" /> Loading saved posts...
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl text-base text-stone-500 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <FiAlertCircle className="inline-block mr-2" /> {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-6 rounded-2xl text-center text-stone-500 dark:text-stone-300 bg-stone-100 dark:bg-stone-800">
            No bookmarks yet. Save your favorite posts to quickly revisit them.
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

export default Bookmarks;
