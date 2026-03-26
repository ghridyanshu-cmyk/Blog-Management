import React, { useState } from 'react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await API.post('/users/login', formData);
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        // Store token in localStorage
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to home after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to login. Please check your connection and try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-6 transition-colors duration-500">
      
      {/* Background "Liquid" Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-stone-300/20 rounded-full blur-3xl"></div>

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl shadow-2xl p-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Welcome Back</h2>
          <p className="text-sm text-stone-500 mt-2">Enter your details to access your blog dashboard.</p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-700 dark:text-red-300 mb-1">
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
            <p className="text-sm text-green-700 dark:text-green-300">✓ {successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-stone-100 transition-colors" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-stone-100 transition-colors" />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 outline-none transition-all shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            {!loading && <FiArrowRight />}
          </button>
        </form>

        {/* Social Logins */}
        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
            <span className="absolute bg-transparent px-4 text-xs font-semibold text-stone-400 uppercase">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center py-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-white/50 transition-colors">
              <FcGoogle className="text-xl" />
            </button>
            <button type="button" className="flex items-center justify-center py-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-white/50 transition-colors">
              <FaGithub className="text-xl dark:text-white" />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          New here? <a href="/register" className="font-bold text-stone-900 dark:text-stone-100 underline decoration-stone-300">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;