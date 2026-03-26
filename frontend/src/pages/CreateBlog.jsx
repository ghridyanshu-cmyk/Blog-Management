import React, { useState, useRef, useEffect } from 'react';
import { FiImage, FiSend, FiChevronLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [user, setUser] = useState(null);

  const categories = ['Tech', 'Health', 'Education', 'Sports', 'Lifestyle'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));

    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setPreview(url);
  };

  const calculateReadTime = (text) => {
    if (!text || text.trim().length === 0) return '0 min';
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return; // Prevent submission if invalid
    
    setErrors([]);
    setLoading(true);

    try {
      const response = await API.post('/blogs', formData);
      if (response.data) {
        alert('Blog published successfully!');
        navigate('/');
      }
    } catch (error) {
      const errorData = error.response?.data;
      let msg = 'Failed to create blog. Please try again.';
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        msg = errorData.errors.join(', ');
      } else if (errorData?.message) {
        msg = errorData.message;
      }
      
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title && formData.category && formData.content.length >= 10 && formData.image;

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-500">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-900 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <FiChevronLeft />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-xs text-stone-400 font-medium italic">
              {formData.content ? `${calculateReadTime(formData.content)} read` : 'Draft'}
            </span>
            <button 
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="px-5 py-2 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
            <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700 dark:text-red-300 mb-1">{error}</p>
              ))}
            </div>
          </div>
        )}

        {/* Cover Image */}
        <div className="group relative w-full h-40 md:h-60 mb-12 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center overflow-hidden transition-all hover:border-stone-200">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center space-y-2 text-stone-400 opacity-60">
              <FiImage size={32} />
              <span className="text-xs font-bold uppercase tracking-tighter">Add Cover Image URL</span>
            </div>
          )}
          <input 
            type="text" 
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Paste image URL here"
            className="absolute inset-0 rounded-3xl opacity-0 cursor-pointer focus:opacity-100 bg-white/90 dark:bg-stone-900/90 backdrop-blur p-4 outline-none text-stone-700 dark:text-stone-200 text-center"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            ref={titleRef}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Write an impressive title..."
            className="w-full text-5xl md:text-6xl font-serif font-bold bg-transparent outline-none resize-none text-stone-900 dark:text-white placeholder:text-stone-100 dark:placeholder:text-stone-800"
            style={{ overflow: 'hidden' }}
          />

          <div className="flex items-center space-x-4 border-b border-stone-50 dark:border-stone-900 pb-4">
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white outline-none"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Tell your story..."
            className="w-full min-h-[400px] text-xl leading-relaxed bg-transparent outline-none resize-none text-stone-700 dark:text-stone-300 placeholder:text-stone-200 dark:placeholder:text-stone-800 font-light"
          />

          {/* ADDED: Bottom Post Button and Word Count */}
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between border-t border-stone-100 dark:border-stone-900 gap-6">
            <div className="text-xs text-stone-400 uppercase tracking-widest font-bold">
              {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words • {calculateReadTime(formData.content)}
            </div>
            
            <button 
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full md:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <FiSend size={18} />
              <span>{loading ? 'Publishing...' : 'Publish Post Now'}</span>
            </button>
          </div>
        </form>

        <div className="mt-16 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl text-sm text-blue-700 dark:text-blue-300 flex items-center space-x-3">
          <FiCheckCircle className="flex-shrink-0" />
          <p>Ready to go? Once you click publish, your story will be live for everyone.</p>
        </div>
      </main>
    </div>
  );
};

export default CreateBlog;