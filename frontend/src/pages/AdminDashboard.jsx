import React, { useEffect, useState } from 'react';
import { FiPlus, FiBarChart2, FiLayers, FiEye, FiEdit3, FiTrash2, FiActivity, FiSettings, FiArrowRight, FiAlertCircle, FiUser, FiHeart } from 'react-icons/fi';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Blogs', value: '0', icon: <FiLayers />, color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
    { label: 'Total Users', value: '0', icon: <FiUser />, color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    { label: 'Total Likes', value: '0', icon: <FiHeart />, color: 'bg-green-500', glow: 'shadow-green-500/20' }
  ]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, blogsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/blogs')
        ]);

        setStats([
          { label: 'Total Blogs', value: statsRes.data.totalBlogs || 0, icon: <FiLayers />, color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
          { label: 'Total Users', value: statsRes.data.totalUsers || 0, icon: <FiUser />, color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
          { label: 'Total Likes', value: statsRes.data.totalLikes || 0, icon: <FiHeart />, color: 'bg-green-500', glow: 'shadow-green-500/20' }
        ]);

        setBlogs(blogsRes.data || []);
        setError('');
      } catch (err) {
        console.error('Admin data fetch error:', err);
        setError('Unable to load admin data. Please check permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await API.delete(`/blogs/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      // Update stats after deletion
      const updatedStats = stats.map(stat => {
        if (stat.label === 'Total Blogs') {
          return { ...stat, value: parseInt(stat.value) - 1 };
        }
        return stat;
      });
      setStats(updatedStats);
    } catch (err) {
      console.error('Delete blog error:', err);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleEditBlog = (blogId) => {
    // For now, just redirect to the blog details page
    // In a full implementation, you might want to create an edit page
    window.location.href = `/blog/${blogId}`;
  };

  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-6">
        <div className="text-center bg-white dark:bg-stone-900 p-10 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={40} />
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Admin access required</h2>
          <p className="text-stone-500 dark:text-stone-400">You need admin permissions to view this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. LIQUID BACKGROUND (Same as Home/Login) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-[-5%] w-72 h-72 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-[-5%] w-96 h-96 bg-green-500/10 dark:bg-green-600/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              <FiSettings className="animate-spin-slow" />
              <span>System Active</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 dark:text-white leading-tight">Management Console</h1>
            <p className="text-stone-500 mt-2 text-sm md:text-base">Monitor your content performance and manage digital assets.</p>
          </div>
          <button className="flex items-center justify-center space-x-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-600 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-2xl active:scale-95">
            <FiPlus size={18} />
            <span>Create New Post</span>
          </button>
        </header>

        {/* 2. Bento Grid Stats (Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="group p-6 rounded-[2.5rem] bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-stone-100 dark:border-stone-800 shadow-sm flex items-center space-x-5 hover:border-green-500/30 transition-all">
              <div className={`p-4 rounded-2xl ${stat.color} text-white text-2xl shadow-lg ${stat.glow} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Main Management Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Posts List */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white whitespace-nowrap">Active Content</h2>
              <div className="h-px w-full bg-stone-200 dark:bg-stone-800"></div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="p-8 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">Loading posts...</div>
              ) : error ? (
                <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">{error}</div>
              ) : blogs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">No blog posts found.</div>
              ) : (
                blogs.map((blogItem) => (
                  <div key={blogItem._id} className="group p-4 md:p-5 rounded-3xl bg-white/40 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:bg-white/80 dark:hover:bg-stone-900/80 transition-all shadow-xs">
                    <div className="flex items-center space-x-5">
                      <div className="h-16 w-16 rounded-2xl bg-stone-200 dark:bg-stone-800 overflow-hidden border border-stone-100 dark:border-stone-800 flex-shrink-0">
                        <img src={blogItem.image || `https://picsum.photos/200/200?random=${blogItem._id}`} alt="thumb" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-white group-hover:text-green-600 transition-colors line-clamp-1">{blogItem.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full text-stone-400 font-bold uppercase tracking-tighter">{blogItem.category || 'Uncategorized'}</span>
                          <p className="text-[10px] text-stone-400 font-medium">{new Date(blogItem.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditBlog(blogItem._id)}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-green-500 transition-colors shadow-sm"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blogItem._id)}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar: Analytics */}
          <aside className="space-y-8 order-1 lg:order-2">
            <div className="p-8 rounded-[2.5rem] bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl uppercase tracking-tighter">Velocity</h3>
                    <FiActivity className="text-green-500" />
                  </div>
                  <div className="flex items-end space-x-2 h-24 mb-6">
                    <div className="bg-green-500/40 w-full h-1/2 rounded-lg group-hover:h-2/3 transition-all duration-700"></div>
                    <div className="bg-green-500/60 w-full h-3/4 rounded-lg group-hover:h-full transition-all duration-700 delay-75"></div>
                    <div className="bg-green-500 w-full h-full rounded-lg group-hover:h-1/2 transition-all duration-700 delay-150"></div>
                    <div className="bg-green-500/40 w-full h-2/3 rounded-lg group-hover:h-3/4 transition-all duration-700 delay-200"></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Growth Score: +12%</p>
               </div>
               <FiBarChart2 className="absolute -bottom-6 -right-6 text-8xl text-white/5 dark:text-stone-900/5 rotate-12" />
            </div>

            {/* Quick Link Card */}
            <div className="p-8 rounded-[2.5rem] bg-green-500 text-white shadow-xl hover:bg-green-600 transition-all cursor-pointer group">
              <h3 className="font-bold text-lg mb-2">Need help?</h3>
              <p className="text-white/80 text-sm mb-6">Check the documentation for advanced API integrations.</p>
              <div className="flex items-center space-x-2 font-black text-xs uppercase tracking-widest">
                <span>View Docs</span>
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;