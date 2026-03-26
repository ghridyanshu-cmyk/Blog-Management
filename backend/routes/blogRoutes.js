const express = require('express');
const router = express.Router();
const { 
  getBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { validateBlogData, validateComment } = require('../middleware/validationMiddleware');

router.get('/', getBlogs);           
router.get('/:id', getBlogById);     

// Private Routes (Only logged-in users)
router.post('/', protect, validateBlogData, createBlog);    
router.put('/:id', protect, validateBlogData, updateBlog);  
router.delete('/:id', protect, deleteBlog); 

// Like/Unlike routes
router.put('/:id/like', protect, likeBlog); 

// Comment routes
router.post('/:id/comments', protect, validateComment, addComment); 
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;