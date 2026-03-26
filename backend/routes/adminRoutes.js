const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getAllBlogs,
  getBlogStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);           
router.delete('/users/:id', protect, admin, deleteUser);  
router.get('/blogs', protect, admin, getAllBlogs);        
router.get('/stats', protect, admin, getBlogStats);     

module.exports = router;