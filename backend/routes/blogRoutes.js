const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { protect } = require('../middleware/authMiddleware');
const { 
    getBlogs, getBlogById, createBlog, updateBlog, 
    deleteBlog, likeBlog, addComment, deleteComment 
} = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:id', getBlogById);

router.post('/', protect, upload.single('image'), createBlog);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

router.put('/:id/like', protect, likeBlog);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;