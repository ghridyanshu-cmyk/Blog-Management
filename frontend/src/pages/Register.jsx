import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[!@#$%^&*]/.test(value)) strength++;
      setPasswordStrength(strength);
    }

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
      const response = await API.post('/users/register', formData);
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        // Store token in localStorage
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('userChanged'));
        
        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Failed to register. Please check your connection and try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-6 transition-colors duration-500">
      
      {/* Background "Liquid" Blobs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-stone-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl shadow-2xl p-10">
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Create Account</h2>
          <p className="text-sm text-stone-500 mt-2">Join our community and start sharing your stories.</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="relative group">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-stone-100 transition-colors" />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 outline-none transition-all shadow-inner"
            />
          </div>

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
              placeholder="Create Password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="px-2 space-y-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded transition-colors ${
                      i < passwordStrength
                        ? passwordStrength <= 2
                          ? 'bg-red-500'
                          : passwordStrength <= 4
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-500">
                {passwordStrength <= 2 ? '⚠️ Weak' : passwordStrength <= 4 ? '⚡ Medium' : '✓ Strong'} password
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 px-2 text-xs text-stone-500">
            <FiCheckCircle className={formData.password.length >= 6 ? 'text-green-500' : 'text-stone-300'} />
            <span>At least 6 characters long</span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" className="flex items-center justify-center w-full py-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-white/50 transition-colors text-sm font-medium">
            <FcGoogle className="mr-2 text-xl" /> Sign up with Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Already have an account? <a href="/login" className="font-bold text-stone-900 dark:text-stone-100 underline decoration-stone-300">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;