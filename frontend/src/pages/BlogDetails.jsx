import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiArrowLeft, FiBookmark, FiShare2, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import API from '../services/api';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchBlog = async () => {
      try {
        const response = await API.get(`/blogs/${id}`);
        setBlog(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load blog. Please try again.');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToComments = () => {
    document.getElementById('comments-anchor').scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 dark:text-red-300 mb-4">{error || 'Blog not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-medium hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const authorInitial = blog.author?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-[-10%] w-72 h-72 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-[-10%] w-96 h-96 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      {/* Top Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-green-600 dark:bg-green-400 z-[120] transition-all duration-75 shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
        style={{ width: `${readingProgress}%` }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
        
        {/* Navigation & Engagement Bar */}
        <div className="max-w-3xl mx-auto mb-12 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
            <FiArrowLeft />
            <span className="hidden sm:inline">Back to Feed</span>
          </button>

          <div className="flex items-center space-x-3">
            <LikeButton 
              blogId={blog._id} 
              initialLikes={blog.likes}
              currentUser={user}
            />

            <button 
              onClick={scrollToComments}
              className="p-3 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-green-500 transition-all shadow-sm relative"
            >
              <FiMessageCircle size={18} />
              {blog.comments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {blog.comments.length}
                </span>
              )}
            </button>

            <button 
              onClick={handleCopyLink}
              className="p-3 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all shadow-sm"
            >
              {copied ? <FiCheck className="text-green-500" size={18} /> : <FiShare2 size={18} />}
            </button>
          </div>
        </div>

        {/* Headline Section */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {blog.category}
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 dark:text-white leading-[1.1] mb-10">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white dark:border-stone-900 overflow-hidden shadow-xl flex items-center justify-center text-white font-bold">
              {authorInitial}
            </div>
            <div className="text-left text-sm">
              <p className="font-bold text-stone-900 dark:text-white">{blog.author?.name}</p>
              <p className="text-stone-400">{blog.readTime || '5 min'} read • {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="w-full h-[350px] md:h-[600px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-16 relative border border-white/20 dark:border-stone-800">
          <img 
            src={blog.image} 
            className="w-full h-full object-cover" 
            alt={blog.title}
            onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image'}
          />
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-stone dark:prose-invert prose-lg max-w-none">
            <div className="text-xl md:text-2xl leading-relaxed text-stone-800 dark:text-stone-200 font-serif mb-12 whitespace-pre-wrap">
              {blog.content}
            </div>
          </article>

          {/* Comments Section */}
          <div id="comments-anchor" className="mt-32 pt-20 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center space-x-4 mb-12">
              <div className="p-4 bg-green-500/10 rounded-[1.5rem] text-green-600 dark:text-green-400">
                <FiMessageCircle size={30} />
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Conversations</h3>
                <p className="text-sm text-stone-400 uppercase tracking-widest font-bold">Join the discussion</p>
              </div>
            </div>
            <CommentSection blogId={blog._id} comments={blog.comments || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;