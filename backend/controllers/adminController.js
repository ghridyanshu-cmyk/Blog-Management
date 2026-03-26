const User = require('../models/User');
const Blog = require('../models/Blog');

// @desc    Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Blog.aggregate([
      { $unwind: '$comments' },
      { $count: 'totalComments' }
    ]);
    const totalLikes = await Blog.aggregate([
      { $unwind: '$likes' },
      { $count: 'totalLikes' }
    ]);
    
    const stats = {
      totalBlogs,
      totalUsers,
      totalComments: totalComments[0]?.totalComments || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getAllBlogs,
  getBlogStats
};