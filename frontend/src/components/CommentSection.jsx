import React, { useState, useEffect } from 'react';
import { FiSend, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import API from '../services/api';

const CommentSection = ({ blogId, comments = [] }) => {
  const [commentText, setCommentText] = useState('');
  const [allComments, setAllComments] = useState(comments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post(`/blogs/${blogId}/comments`, {
        text: commentText
      });

      const newComment = {
        _id: Date.now().toString(),
        user: user._id,
        userName: user.name,
        text: commentText,
        date: new Date().toISOString()
      };

      setAllComments([newComment, ...allComments]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await API.delete(`/blogs/${blogId}/comments/${commentId}`);
        setAllComments(allComments.filter(c => c._id !== commentId));
      } catch (err) {
        setError('Failed to delete comment');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-10">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-2">
          <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="relative group">
          <textarea 
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Add to the discussion..."
            maxLength={500}
            className="w-full p-6 rounded-3xl bg-stone-100 dark:bg-stone-900/50 border border-transparent focus:border-stone-200 dark:focus:border-stone-800 outline-none transition-all resize-none min-h-[120px] text-stone-700 dark:text-stone-300 shadow-inner"
          />
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <span className="text-xs text-stone-400">{commentText.length}/500</span>
            <button 
              type="submit"
              disabled={loading || !commentText.trim()}
              className="p-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl text-center">
          <p className="text-blue-700 dark:text-blue-300 font-medium">
            <a href="/login" className="underline font-bold hover:text-blue-900 dark:hover:text-blue-100">
              Sign in
            </a>
            {' '}to share your thoughts
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {allComments.length === 0 ? (
          <p className="text-center py-8 text-stone-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          allComments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {comment.userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3 justify-between">
                  <div>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">{comment.userName || 'Anonymous'}</span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-3">{formatDate(comment.date)}</span>
                  </div>
                  {user && (user._id === comment.user || user.isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      title="Delete comment"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;