import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiArrowLeft, FiShare2, FiCheck, FiAlertCircle, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
    
    const fetchBlog = async () => {
      try {
        const response = await API.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, location]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm('Delete this story forever?')) return;
    try {
      await API.delete(`/blogs/${blog._id}`);
      navigate('/');
    } catch (err) {
      alert('Delete failed: You are not authorized to delete this post.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 dark:border-white"></div>
    </div>
  );

  if (error || !blog) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-center px-6">
      <div className="max-w-md w-full">
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 dark:text-red-300 mb-6 font-bold">{error || 'Blog not found'}</p>
        <button onClick={() => navigate('/')} className="w-full sm:w-auto px-6 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold">Go Home</button>
      </div>
    </div>
  );

  const isOwner = user && blog.author && (user._id === blog.author._id || user.id === blog.author._id);

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 md:top-20 left-[-20%] md:left-[-10%] w-64 md:w-72 h-64 md:h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 right-[-20%] md:right-[-10%] w-80 md:w-96 h-80 md:h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="fixed top-0 left-0 h-1 md:h-1.5 bg-green-500 z-[120] transition-all duration-75" style={{ width: `${readingProgress}%` }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto mb-8 md:mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-3">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all text-[10px] md:text-xs font-black uppercase tracking-widest self-start sm:self-center">
            <FiArrowLeft /> <span>Back to Feed</span>
          </button>

          <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-end">
            <LikeButton blogId={blog._id} initialLikes={blog.likes} currentUser={user} />
            
            {isOwner && (
              <div className="flex space-x-2">
                <button onClick={() => navigate(`/create?edit=${blog._id}`)} className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-blue-500 transition-all shadow-sm">
                  <FiEdit3 size={18} />
                </button>
                <button onClick={handleDeleteBlog} className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-500 transition-all shadow-sm">
                  <FiTrash2 size={18} />
                </button>
              </div>
            )}

            <button onClick={handleCopyLink} className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all shadow-sm">
              {copied ? <FiCheck className="text-green-500" /> : <FiShare2 size={18} />}
            </button>
          </div>
        </div>

        <header className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
          <div className="inline-flex items-center px-3 md:px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8">
            {blog.category}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-stone-900 dark:text-white leading-[1.2] md:leading-[1.1] mb-8 md:mb-10 px-2">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
              {blog.author?.name ? blog.author.name[0].toUpperCase() : 'A'}
            </div>
            <div className="text-left text-xs md:text-sm">
              <p className="font-bold text-stone-900 dark:text-white">{blog.author?.name}</p>
              <p className="text-stone-400 font-medium">
                {blog.readTime || '5 min'} read • {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </header>

        <div className="w-full h-[250px] sm:h-[400px] md:h-[600px] rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-12 md:mb-16 border border-white/20 dark:border-stone-800">
          <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
        </div>

        <div className="max-w-3xl mx-auto px-2">
          <article className="prose prose-stone dark:prose-invert prose-base sm:prose-lg max-w-none">
            <div className="text-lg md:text-2xl leading-[1.6] md:leading-relaxed text-stone-800 dark:text-stone-200 font-serif mb-12 whitespace-pre-wrap">
              {blog.content}
            </div>
          </article>
          
          <div id="comments-anchor" className="mt-20 md:mt-32 pt-16 md:pt-20 border-t border-stone-200 dark:border-stone-800">
            {/* --- CRITICAL FIX: Passing blogAuthorId below --- */}
            <CommentSection 
              key={blog._id}
              blogId={blog._id} 
              comments={blog.comments || []} 
              blogAuthorId={blog.author?._id || blog.author?.id || blog.author}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;