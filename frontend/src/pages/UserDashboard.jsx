import React, { useEffect, useState } from 'react';
import { FiEdit3, FiTrash2, FiHeart, FiMessageCircle, FiAlertCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsed = JSON.parse(userData);
    setUser(parsed);

    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/blogs?author=${parsed._id}`);

        if (response.data?.blogs) {
          setBlogs(response.data.blogs);
          setError('');
        } else {
          setBlogs([]);
          setError('Unable to load blog data.');
        }
      } catch (err) {
        console.error('Failed to fetch user blog dashboard', err);
        setError('Failed to load your posts. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [navigate, location]);

  useEffect(() => {
    const handleUserUpdate = () => {
      const userData = localStorage.getItem('user');
      const parsed = userData ? JSON.parse(userData) : null;
      setUser(parsed);
    };

    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('userChanged', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('userChanged', handleUserUpdate);
    };
  }, []);

  const totalLikes = blogs.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
  const totalComments = blogs.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

  const handleEdit = (blogId) => {
    navigate(`/create?edit=${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await API.delete(`/blogs/${blogId}`);
      const updated = blogs.filter((b) => b._id !== blogId);
      setBlogs(updated);
    } catch (err) {
      console.error('Delete blog error:', err);
      alert('Unable to delete post. Please try again.');
    }
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">My Dashboard</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your posts: likes, comments, edit and delete.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
            <h3 className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest">Your Posts</h3>
            <p className="mt-3 text-3xl font-bold text-stone-900 dark:text-white">{blogs.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
            <h3 className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest">Total Likes</h3>
            <p className="mt-3 text-3xl font-bold text-stone-900 dark:text-white">{totalLikes}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
            <h3 className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest">Total Comments</h3>
            <p className="mt-3 text-3xl font-bold text-stone-900 dark:text-white">{totalComments}</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">Loading your posts...</div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">No posts yet. Create your first blog.</div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="group p-4 md:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white line-clamp-2">{blog.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{blog.category || 'Uncategorized'} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">{(blog.content || '').slice(0, 120)}...</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1"><FiHeart /> {blog.likes?.length || 0}</span>
                    <span className="inline-flex items-center gap-1"><FiMessageCircle /> {blog.comments?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(blog._id)} className="px-3 py-2 rounded-xl bg-blue-500 text-white text-xs hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(blog._id)} className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
