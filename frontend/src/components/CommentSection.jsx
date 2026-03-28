import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiTrash2, FiCornerDownRight, FiX } from 'react-icons/fi';
import API from '../services/api';

const CommentSection = ({ blogId, comments = [], blogAuthorId }) => {
  const [commentText, setCommentText] = useState('');
  const [allComments, setAllComments] = useState(comments);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const scrollRef = useRef(null);
  
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Remove this comment forever?')) return;
    try {
      const response = await API.delete(`/blogs/${blogId}/comments/${commentId}`);
      if (response.data.success) {
        setAllComments(response.data.comments);
      }
    } catch (err) {
      alert('Delete failed. You may not have permission.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;
    
    setLoading(true);
    const finalTag = replyingTo ? `@${replyingTo} ` : "";
    
    try {
      const response = await API.post(`/blogs/${blogId}/comments`, { 
        text: finalTag + commentText 
      });
      if (response.data.success) {
        setAllComments(response.data.comments);
        setCommentText('');
        setReplyingTo(null);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. INPUT BOX */}
      {user && (
        <div className="space-y-2" ref={scrollRef}>
          {replyingTo && (
            <div className="flex items-center justify-between px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
              <span className="text-xs font-black text-green-600 uppercase flex items-center gap-2 tracking-widest">
                <FiCornerDownRight /> Replying to @{replyingTo}
              </span>
              <button onClick={() => setReplyingTo(null)} className="text-stone-400 hover:text-red-500">
                <FiX size={16} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleAddComment} className="relative group">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyingTo ? "Write your response..." : "Join the discussion..."}
              className="w-full p-6 rounded-[2rem] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white min-h-[120px] outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
            />
            <button type="submit" disabled={!commentText.trim() || loading} className="absolute bottom-4 right-4 p-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl shadow-lg hover:scale-105 transition-all">
              <FiSend size={20} />
            </button>
          </form>
        </div>
      )}

      {/* 2. COMMENTS LIST */}
      <div className="space-y-6">
        {allComments.map((comment) => {
          // SECURE ID COMPARISON
          const myId = String(user?._id || user?.id || "");
          const writerId = String(comment.user?._id || comment.user || "");
          const ownerId = String(blogAuthorId || "");
          
          // PERMISSION LOGIC: I am the writer OR I am the Blog Author
          const canDelete = myId !== "" && (myId === writerId || myId === ownerId);
          const isReply = comment.text.startsWith('@');
          const displayName = comment.name || "Member";

          return (
            <div 
              key={comment._id} 
              className={`flex gap-4 items-start group ${isReply ? 'ml-8 md:ml-16 border-l-2 border-stone-200 dark:border-stone-800 pl-4 md:pl-6' : ''}`}
            >
              {/* Avatar */}
              <div className={`rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-black shrink-0 shadow-md transition-all
                ${isReply ? 'h-9 w-9 text-xs' : 'h-12 w-12 text-base'}`}>
                {displayName[0].toUpperCase()}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
                      {displayName}
                    </span>
                    {writerId === ownerId && (
                      <span className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">Author</span>
                    )}
                  </div>

                  {/* ACTION BUTTONS (ALWAYS VISIBLE) */}
                  <div className="flex items-center gap-3">
                    {user && !isReply && (
                        <button 
                          onClick={() => {
                            setReplyingTo(displayName);
                            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-[10px] font-black text-stone-400 hover:text-green-500 uppercase tracking-widest transition-colors"
                        >
                          Reply
                        </button>
                    )}

                    {canDelete && (
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        title="Delete Comment"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-stone-800 dark:text-stone-200 text-sm md:text-base leading-relaxed">
                   {isReply ? (
                     <>
                       <span className="text-green-600 font-bold mr-1">{comment.text.split(' ')[0]}</span>
                       {comment.text.substring(comment.text.split(' ')[0].length)}
                     </>
                   ) : comment.text}
                </p>
                <div className="text-[9px] text-stone-400 font-bold uppercase mt-2 tracking-widest">
                   {new Date(comment.createdAt || comment.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;