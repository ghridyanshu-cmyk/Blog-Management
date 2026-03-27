const Blog = require('../models/Blog');

const calculateReadTime = (content) => {
  if (!content || !content.trim()) return '1 min';
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min`;
};

const getBlogs = async (req, res) => {
  try {
    const { category, author } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('likes', '_id')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      blogsCount: blogs.length,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to fetch blogs. Please try again.']
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('likes', '_id')
      .populate('comments.user', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to fetch blog. Please try again.']
    });
  }
};

const createBlog = async (req, res) => {
  const { title, category, content, image, readTime } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        errors: ['Authentication required to create a blog']
      });
    }

    if (!title || !category || !content || !image) {
      return res.status(400).json({
        success: false,
        errors: ['Title, category, content, and image are required']
      });
    }

    const resolvedReadTime = readTime && readTime.trim() ? readTime.trim() : calculateReadTime(content);

    const blog = new Blog({
      author: req.user._id,
      title: title.trim(),
      category,
      content: content.trim(),
      image: image.trim(),
      readTime: resolvedReadTime
    });

    const createdBlog = await blog.save();
    const populatedBlog = await createdBlog.populate('author', 'name avatar');

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: populatedBlog
    });
  } catch (error) {
    console.error('createBlog error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }

    res.status(500).json({
      success: false,
      errors: ['Failed to create blog. Please try again.']
    });
  }
};

const updateBlog = async (req, res) => {
  const { title, category, content, image, readTime } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        errors: ['Not authorized to update this blog']
      });
    }

    blog.title = title?.trim() || blog.title;
    blog.category = category || blog.category;
    blog.content = content?.trim() || blog.content;
    blog.image = image || blog.image;
    blog.readTime = readTime || blog.readTime;

    const updatedBlog = await blog.save();
    await updatedBlog.populate('author', 'name avatar');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to update blog. Please try again.']
    });
  }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    const userId = req.user._id.toString();
    const isLiked = blog.likes.map(id => id.toString()).includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();

    res.json({
      success: true,
      message: isLiked ? 'Blog unliked' : 'Blog liked',
      likesCount: blog.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to update like. Please try again.']
    });
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    const newComment = {
      user: req.user._id,
      userName: req.user.name,
      text: text.trim()
    };

    blog.comments.push(newComment);
    const savedBlog = await blog.save();
    await savedBlog.populate('comments.user', 'name');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comments: savedBlog.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to add comment. Please try again.']
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        errors: ['Comment not found']
      });
    }

    if (comment.user.toString() !== req.user._id.toString() &&
        blog.author.toString() !== req.user._id.toString() &&
        !req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        errors: ['Not authorized to delete this comment']
      });
    }

    blog.comments.pull(req.params.commentId);
    await blog.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to delete comment. Please try again.']
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        errors: ['Blog not found']
      });
    }

    if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        errors: ['Not authorized to delete this blog']
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ['Failed to delete blog. Please try again.']
    });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment
};