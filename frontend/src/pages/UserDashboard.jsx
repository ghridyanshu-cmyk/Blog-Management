import React, { useEffect, useState } from 'react';
import { FiEdit3, FiTrash2, FiHeart, FiMessageCircle, FiPlus, FiBarChart2 } from 'react-icons/fi';
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
        const response = await API.get(`/blogs?author=${parsed._id || parsed.id}`);

        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);
          setError('');
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
        setError('Failed to load your posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [navigate, location]);

  const totalLikes = blogs.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
  const totalComments = blogs.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/blogs/${blogId}`);
      setBlogs(prev => prev.filter((b) => b._id !== blogId));
    } catch (err) {
      alert('Unable to delete post.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-16 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-white">Author Dashboard</h1>
            <p className="text-stone-700 dark:text-stone-200 mt-2 font-medium">Welcome back, {user.name}. Here is your performance overview.</p>
          </div>
          <button 
            onClick={() => navigate('/create')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
          >
            <FiPlus size={20} /> <span>New Story</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Your Stories', value: blogs.length, icon: <FiBarChart2 className="text-blue-600 dark:text-blue-400" /> },
            { label: 'Total Likes', value: totalLikes, icon: <FiHeart className="text-red-600 dark:text-red-400" /> },
            { label: 'Comments', value: totalComments, icon: <FiMessageCircle className="text-purple-600 dark:text-purple-400" /> }
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">{stat.icon}</div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">{stat.label}</span>
              </div>
              <p className="text-5xl font-black text-stone-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Blog List Section */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Your Publications</h2>
            <div className="h-px flex-grow ml-6 bg-stone-200 dark:bg-stone-800 hidden sm:block"></div>
        </div>
        
        {loading ? (
          <div className="py-20 text-center text-stone-900 dark:text-white font-black uppercase tracking-widest animate-pulse">
            Syncing your database...
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-100 text-red-700 border border-red-200 font-bold">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="py-24 rounded-[3rem] bg-white dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 text-center">
            <p className="text-stone-900 dark:text-white text-xl font-bold mb-6">No stories found in your account.</p>
            <button onClick={() => navigate('/create')} className="px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold">Write Your First Blog</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="group p-5 rounded-[2.5rem] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-all flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-xl">
                
                {/* Thumbnail */}
                <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-stone-200 dark:bg-stone-800">
                  <img 
                    src={blog.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>

                {/* Content Info */}
                <div className="flex-grow">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1 block">{blog.category}</span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white line-clamp-1 mb-2">{blog.title}</h3>
                  <div className="flex flex-wrap items-center gap-5 text-sm text-stone-700 dark:text-stone-200 font-bold">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><FiHeart className="text-red-500" /> {blog.likes?.length || 0}</span>
                    <span className="flex items-center gap-1.5"><FiMessageCircle className="text-blue-500" /> {blog.comments?.length || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:ml-auto">
                  <button 
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-stone-200 transition-all font-bold text-xs uppercase"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => navigate(`/create?edit=${blog._id}`)}
                    className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-all font-bold text-xs uppercase"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 transition-all font-bold text-xs uppercase"
                  >
                    Delete
                  </button>
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